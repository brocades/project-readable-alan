import React, { Component } from 'react';
import { If, Then, Else } from 'react-if'
import { connect } from 'react-redux'
import Post from './Post'
import '../App.css';

function CategoryPosts(props) {
	let posts = props.posts
		.filter(post => post.category === props.category)
		.filter(post => !post.deleted)
	if (props.category === "all")
		posts = props.posts.filter(post => !post.deleted)
	return (
			<If condition={posts.length > 0}>
        <Then>
		      <section className="posts-content">
		  			{posts
		          .map((post) => (
		            <Post
		              type="display"
		              key={post.id}
		              post={post}/>
		          ))}
		      </section>
        </Then>
        <Else>
           <p> This category has no posts </p>
        </Else>
      </If>
	)
}

function mapStateToProps({ post, comment }) {
  const allComments = Object.keys(comment.comments).map(key => comment.comments[key])

  return {
    posts: Object.values(post.posts).reduce((postsArray, singlePost) => {
      postsArray.push({
        ...singlePost,
        comments: allComments.filter(singleComment => singleComment.parentId === singlePost.id)
      })
      return postsArray
    }, [])
  }
}

export default connect(mapStateToProps)(CategoryPosts)
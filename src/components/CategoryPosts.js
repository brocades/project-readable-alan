import React, { Component } from 'react';
import { If, Then, Else } from 'react-if'
import { connect } from 'react-redux'
import Post from './Post'
import '../App.css';

class CategoryPosts extends Component {
	render() {
		let posts = this.props.posts
			.filter(post => post.category === this.props.category)
			.filter(post => !post.deleted)
		if (this.props.category === "all")
			posts = this.props.posts.filter(post => !post.deleted)
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
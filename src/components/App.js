import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom'
import '../App.css';
import Post from './Post'
import CategoryPosts from './CategoryPosts'
import PostDetails from './PostDetails'
import PostSubmit from './PostSubmit'
import * as ReadableAPI from '../ReadableAPI'
import { connect } from 'react-redux'

class App extends Component {

  controlSelectedColor = (selectedCategory) => {
    for (let category of this.props.categories) {
      const categoryElement = document.getElementById(category.name)
        categoryElement.classList.remove("selected-color")
      if (selectedCategory === category.name) {
        categoryElement.classList.add("selected-color")
      }
    }
  }

  selectCategoryPosts = (categoryName) => {
    this.controlSelectedColor(categoryName)
    //this.getCategoryPosts(categoryName)
  }

  getCategoryPosts = (categoryName) => {
    if (categoryName !== "all") {
      ReadableAPI.getCategoryPosts(categoryName).then((posts) => {
        this.setState({ posts })
      })
    } else {
      ReadableAPI.getAllPosts().then((posts) => {
        this.setState({ posts })
      })
    }
  }

  getAllPosts = () => {
    ReadableAPI.getAllPosts().then((posts) => {
      this.setState({ posts })
      console.log(posts)
    })
  }
  getPostComments = (post) => {
    ReadableAPI.getPostComments(post).then((comments) => {
    })
  }
  getCategories = () => {
    ReadableAPI.getCategories().then((categories) => {
      this.setState({ categories })
    })
  }

  getPostDetails = (id) => {
    for (let post of this.props.posts)
      if (post.id === id) return post
  }

  componentDidMount() {
    //this.getCategoryPosts(this.state.category)
    //this.getPost(this.state.post)
    //this.getAllPosts()
    //this.getPostComments(this.state.post)
  }

  render() {
    return (
      <div className="App">
        <Route exact path="/" render={() => (
          <Redirect to="/all"/>
        )}/>

        <header>
          <h1 className="app-title">Readable App</h1>
        </header>

        <div className="app-content">
          <section className="categories-section">
            <h2 className="category-title">Categories</h2>
              {this.props.categories.map((category) => (
                  <h2
                    id={category.name}
                    key={category.name}>
                    <Link to={`/${category.name}`}>
                    {category.name}
                    </Link>
                  </h2>
                ))}
          </section>
          <Route exact path="/:category" render={() => (
            <section className="posts-section">
              <section className="app-post-header">
                <h2 className="posts-title">Posts</h2>
                <h2 className="order-by">Order by </h2>
              </section>
              <section className="posts-content">
                <PostSubmit />

              {this.props.categories.map((category) => (
                <Route key={category.path} exact path={`/${category.path}`} render={() => (
                  <CategoryPosts category={category.name}/>
                  )}/>
                ))}
              </section>
            </section>
          )}/>

          <Route exact path="/:category/:id" render={({ match }) => (
            <section className="posts-section">
              <PostDetails
                key={match.params.id}
                post={this.getPostDetails(match.params.id)}/>
            </section>
          )}/>
        </div>
        <footer></footer>
      </div>
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
    }, []),
    categories: post.categories,
  }
}

export default connect(mapStateToProps)(App);

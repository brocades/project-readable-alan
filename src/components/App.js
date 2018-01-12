import React, { Component } from 'react';
import '../App.css';
import Post from './Post'
import * as ReadableAPI from '../ReadableAPI'

class App extends Component {

  state = {
    categories: [],
    posts: [],
  }

  getPost = (post) => {
    ReadableAPI.getPost(post).then((post) => {
      console.log(post)
    })
  }

  getCategoryPosts = (category) => {
    ReadableAPI.getCategoryPosts(category).then((posts) => {
      console.log(posts)
    })
  }
  getAllPosts = () => {
    ReadableAPI.getAllPosts().then((posts) => {
      this.setState({ posts })
      console.log(posts)
    })
  }
  getPostComments = (post) => {
    ReadableAPI.getPostComments(post).then((comments) => {
      console.log(comments)
    })
  }
  getCategories = () => {
    ReadableAPI.getCategories().then((categories) => {
      this.setState({ categories })
      console.log(categories)
    })
  }
  componentDidMount() {
    //this.getCategoryPosts(this.state.category)
    this.getCategories()
    //this.getPost(this.state.post)
    this.getAllPosts()
    //this.getPostComments(this.state.post)
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1 className="app-title">Posts App</h1>
        </header>

        <section className="categories-section">
          <h2 className="category-title">Categories</h2>

            <h2>All</h2>
            {this.state.categories.map((category) => (
                <h2 key={category.name}> {category.name} </h2>
              ))}

        </section>

        <section className="posts-section">
          <section className="app-post-header">
            <h2 className="posts-title">Posts</h2>
            <h2 className="order-by">Order by </h2>
          </section>
          <section className="posts-content">
            {this.state.posts.map((post) => (
                <Post key={post.id} post={post}/>
              ))}
          </section>
        </section>

        <footer></footer>
      </div>
    )
  }
}

export default App;

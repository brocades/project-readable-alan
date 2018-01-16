import React, { Component } from 'react';
import { If, Then, Else } from 'react-if'
import { Route, Link, Redirect } from 'react-router-dom'
import '../App.css';
import Post from './Post'
import * as ReadableAPI from '../ReadableAPI'

class App extends Component {

  state = {
    categories: [],
    posts: [],
  }

  getPost = (id) => {
    let selectedPost = {}
    console.log(`>>> Provided ID: ${id}`)
    ReadableAPI.getPost(id).then((post) => {
      selectedPost = post
    })
    return selectedPost
  }

  getPostWithId = (id) => {
    for (let post of this.state.posts) {
      if (post.id === id) {
        return post
      }
    }
  }

  controlSelectedColor = (selectedCategory) => {
    for (let category of this.state.categories) {
      const categoryElement = document.getElementById(category.name)
        categoryElement.classList.remove("selected-color")
      if (selectedCategory === category.name) {
        categoryElement.classList.add("selected-color")
      }
    }
  }

  selectCategoryPosts = (categoryName) => {
    this.controlSelectedColor(categoryName)
    this.getCategoryPosts(categoryName)
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
        <Route exact path="/" render={() => (
          <Redirect to="/all"/>
        )}/>
        <Route exact path="/:category" render={() => (
          <div className="app-content">
            <header>
              <h1 className="app-title">Posts App</h1>
            </header>

            <section className="categories-section">
              <h2 className="category-title">Categories</h2>
                {this.state.categories.map((category) => (
                    <h2
                      id={category.name}
                      key={category.name}
                      onClick={() => this.selectCategoryPosts(category.name)}>
                      <Link to={`/${category.name}`}>
                      {category.name}
                      </Link>
                      </h2>
                  ))}

            </section>

            <section className="posts-section">
              <section className="app-post-header">
                <h2 className="posts-title">Posts</h2>
                <h2 className="order-by">Order by </h2>
              </section>
              <section className="posts-content">
                <Post type="submit" categories={this.state.categories}/>
              </section>
              <If condition={this.state.posts.length > 0}>
                <Then>
                  <section className="posts-content">
                    {this.state.posts.map((post) => (
                        <Post
                          type="display"
                          categories={this.state.categories}
                          key={post.id}
                          post={post}/>
                      ))}
                  </section>
                </Then>
                <Else>
                  <section className="posts-content">
                    <p> This category has no posts </p>
                  </section>
                </Else>
              </If>
            </section>

            <footer></footer>
          </div>
          )}/>
        <Route exact path="/:category/:id" render={({ match }) => (
          <div className="app-content">
            <header>
              <h1 className="app-title">Posts App</h1>
            </header>
            <section className="posts-section">
              <Post
                type="details"
                categories={this.state.categories}
                key={match.params.id}
                post={this.getPostWithId(match.params.id)}/>
            </section>
            <footer></footer>
          </div>
          )}/>
      </div>
    )
  }
}

export default App;

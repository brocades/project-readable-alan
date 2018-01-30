import React, { Component } from 'react'
import { connect } from 'react-redux'
import { If, Then, Else } from 'react-if'
import { Link } from 'react-router-dom'
import { FaAngleUp, FaAngleDown, FaEdit, FaClose, FaBan } from 'react-icons/lib/fa'
import '../postdetails.css'
import Comment from './Comment'
import * as ReadableAPI from '../ReadableAPI'
import serializeForm from 'form-serialize'
import PropTypes from 'prop-types'
import { editPost, deletePost, votePost, deleteComment } from '../actions'
let moment = require('moment');

class PostDetails extends Component {

	state = {
		editting: false,
	}

	handlePostEdit = (e) => {
		e.preventDefault()
		const inputValues = serializeForm(e.target, { hash: true })
		console.log(`>>> Original post author: ${this.props.post.author}`)
		let post = Object.assign({}, this.props.post, inputValues)
		console.log(`>>> Editted post author: ${post.author}`)
		this.props.updatePost(post)
		this.toggleEditting()
		ReadableAPI.updatePost(post)
			.catch((reason) => {
				console.log(`>>> Post not updated due to: ${reason}`)
			})
	}

	deletePost = (id) => {
		this.props.deletePost(id)
		for (let comment of this.props.post.comments) {
			this.props.deleteComment(comment.id)
		}
		ReadableAPI.deletePost(id)
			.catch((reason) => {
				console.log(`>>> Post not deleted due to: ${reason}`)
			})
	}

	upVotePost = (id) => {
		const option = "upVote"
		this.props.votePost({ id, option })
		ReadableAPI.votePost(id, option)
			.catch((reason) => {
					console.log(`>>> Vote not registered: ${reason}`)
				})
	}

	downVotePost = (id) => {
		const option = "downVote"
		this.props.votePost({ id, option })
		ReadableAPI.votePost(id, option)
			.catch((reason) => {
					console.log(`>>> Vote not registered: ${reason}`)
				})
	}

	isEditting() {
		return this.state.editting
	}

	toggleEditting() {
		this.setState({ editting: !this.state.editting })
	}

	getValidCategories() {
		const categories = this.props.categories
		const categoriesList = [ ...categories]
		return categoriesList.slice(1)
	}

	getReadableDate() {
		const previousMoment = moment(this.props.post.timestamp)
		const currentMoment = moment()
		const seconds = currentMoment.diff(previousMoment, 'seconds')
		const dateDifference = {
			seconds: seconds,
			minutes: Math.round(seconds/60),
			hours: Math.round(seconds/3600),
		}
		return `${dateDifference.minutes} minutes ago`
	}


	getPostProps() {
		let props = {
			id: null,
			voteScore: null,
			title: null,
			author: null,
			body: null,
			category: null,
			comments: []
		}
		if (this.props.post)
			props = this.props.post
		return props
	}

	render() {
		const { id, voteScore, title, author, body, category, commentCount, comments } = this.getPostProps()
		const categories = this.getValidCategories()
		return (
			<section className="posts-section">
				<section className="app-postdetails-header">
	      	<h2 className="postdetails-title">{title}</h2>
	      </section>

				<section id={id} className="post">
					<If condition={this.isEditting() === false}>
						<Then>
							<section className="postdetails-wrapper">
								<section className="postdetails-vote-score-section">
									<FaAngleUp onClick={() => this.upVotePost(id)}/>
										<p className="postdetails-vote-score">{voteScore}</p>
									<FaAngleDown onClick={() => this.downVotePost(id)}/>
								</section>
								<section className="postdetails-section">
									<section className="postdetails-title-content">
										<section className="postdetails-title-texts">
											<h4>by </h4><h3>{author}</h3>
										</section>
										<section className="postdetails-timeposted">
											<h4>Posted {this.getReadableDate()} </h4>
										</section>
										<section className="postdetails-title-buttons">
											<div className="edit-button" onClick={() => this.toggleEditting()}>
												<FaEdit/>
											</div>
											<Link onClick={() => this.deletePost(id)} to="/">
												<div className="delete-button">
													<FaClose/>
												</div>
											</Link>
										</section>
									</section>

									<section className="postdetails-body">
										<p className="postdetails-body-text">{body}</p>
									</section>
									<h4>This post has {commentCount} comment(s)</h4>
									<If condition={comments instanceof Array}>
										<Then>
											<section className="comments-wrapper">
												{comments
													.filter((comment) => !comment.deleted)
													.map((comment) => (
															<Comment
																type="details"
																parentId={id}
																key={comment.id}
																comment={comment}/>
														))}
												<Comment type="submit" parentId={id}/>
											</section>
										</Then>
										<Else>
											<p>Be the first to comment!</p>
										</Else>
									</If>
								</section>
							</section>
						</Then>
						<Else>
							<form onSubmit={this.handlePostEdit}>
								<section className="postdetails-wrapper">
									<section className="postdetails-section">
										<section className="postdetails-header">
											<input className="postdetails-title-input" type="text" name="title" defaultValue={title} placeholder="React is awesome!"/>
											<h3>by</h3>
											<input className="postdetails-author-input" type="text" name="author" defaultValue={author} placeholder="ex.: Alan Brochier"/>
											<select className="postdetails-category-input" defaultValue={category} name="category">
												{categories.map((category, index) => (
														<option
															key={index}
															value={category.name}>{category.name}</option>
													))}
											</select>
											<div className="cancel-button" onClick={() => this.toggleEditting()}>
												<FaBan/>
											</div>
										</section>
										<section className="postdetails-body">
											<textarea className="postdetails-body-input" name="body" defaultValue={body} placeholder="Write your commentary here...">
											</textarea>
											<input className="postdetails-input-button" type="submit" value="Send"/>
										</section>
										<If condition={comments instanceof Array}>
											<Then>
												<section className="comments-wrapper">
													{comments
														.filter((comment) => !comment.deleted)
														.map((comment) => (
															<Comment
																key={comment.id}
																type="details"
																parentId={id}
																comment={comment}/>
														))}
												</section>
											</Then>
											<Else>
												<p>Be the first to comment!</p>
											</Else>
										</If>
									</section>
								</section>
							</form>
						</Else>
					</If>
				</section>
			</section>
		)
	}
}

PostDetails.propTypes = {
	title: PropTypes.string,
	author: PropTypes.string,
	body: PropTypes.string,
}

function mapStateToProps({ post }) {
	return {
		categories: post.categories
	}
}

function mapDispatchToProps(dispatch) {
	return {
		updatePost: (data) => dispatch(editPost(data)),
		deletePost: (data) => dispatch(deletePost(data)),
		votePost: (data) => dispatch(votePost(data)),
		deleteComment: (data) => dispatch(deleteComment(data)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PostDetails)
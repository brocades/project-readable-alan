import React, { Component } from 'react'
import { connect } from 'react-redux'
import { If, Then, Else } from 'react-if'
import { Link } from 'react-router-dom'
import { FaAngleUp, FaAngleDown, FaEdit, FaClose, FaBan } from 'react-icons/lib/fa'
import '../post.css'
import Comment from './Comment'
import * as ReadableAPI from '../ReadableAPI'
import serializeForm from 'form-serialize'
import PropTypes from 'prop-types'
import { editPost, deletePost, votePost, deleteComment } from '../actions'

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
			<section id={id} className="post">
				<If condition={this.isEditting() === false}>
					<Then>
						<section className="post-wrapper">
							<section className="post-vote-score-section">
								<FaAngleUp onClick={() => this.upVotePost(id)}/>
									<p className="post-vote-score">{voteScore}</p>
								<FaAngleDown onClick={() => this.downVotePost(id)}/>
							</section>
							<section className="post-section">
								<section className="post-title">
									<section className="post-title-texts">
										<h3>{title} by {author}  {commentCount} comments
										</h3>
									</section>
									<section className="post-title-buttons">
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
								<section className="post-body">
									<p className="post-body-text">{body}</p>

								</section>
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
							<section className="post-wrapper">
								<section className="post-section">
									<section className="post-header">
										<input className="post-title-input" type="text" name="title" defaultValue={title} placeholder="React is awesome!"/>
										<h3>by</h3>
										<input className="post-author-input" type="text" name="author" defaultValue={author} placeholder="ex.: Alan Brochier"/>
										<select className="post-category-input" defaultValue={category} name="category">
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
									<section className="post-body">
										<textarea className="post-body-input" name="body" defaultValue={body} placeholder="Write your commentary here...">
										</textarea>
										<input className="post-input-button" type="submit" value="Send"/>
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
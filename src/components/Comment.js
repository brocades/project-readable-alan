import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { If, Then, Else } from 'react-if'
import { FaAngleUp, FaAngleDown, FaEdit, FaClose, FaBan } from 'react-icons/lib/fa'
import '../comment.css'
import * as ReadableAPI from '../ReadableAPI'
import serializeForm from 'form-serialize'
import { sendComment, editComment, deleteComment, voteComment, updateCommentCount } from '../actions'
import { connect } from 'react-redux'
const uuidv1 = require('uuid/v1')

class Comment extends Component {

	state = {
		editting: false,
	}

	toggleEditting() {
		this.setState({ editting: !this.state.editting })
	}

	isEditting() {
		return this.state.editting
	}

	handleCommentUpload = (e) => {
		e.preventDefault()
		const defaultValues = {
			id: uuidv1(),
			timestamp: Date.now(),
			parentId: this.props.parentId,
			parentDeleted: false,
			deleted: false,
			voteScore: 1,
		}
		const inputValues = serializeForm(e.target, { hash: true })
		const comment = {
			...defaultValues,
			...inputValues,
		}
		this.props.updateCommentCount({ id: comment.parentId, option: "increase" })
		this.props.uploadComment(comment)
		ReadableAPI.uploadComment(comment)
			.catch((reason) => {
					console.log(`>>> Comment not uploaded due to: ${reason}`)
				})
		this.resetInputForm()
	}

	resetInputForm = () => {
		const commentUploadForm = document.getElementById("commentUploadForm")
		commentUploadForm.reset()
	}

	handleCommentUpdate = (e) => {
		e.preventDefault()
		const inputValues = serializeForm(e.target, { hash: true })
		let comment = Object.assign({}, this.props.comment, inputValues)
		this.props.updateComment(comment)
		this.toggleEditting()
		ReadableAPI.updateComment(comment)
			.catch((reason) => {
				console.log(`>>> Comment not updated due to: ${reason}`)
			})
	}

	deleteComment = (id) => {
		this.props.updateCommentCount({ id: this.props.parentId, option: "decrease" })
		this.props.deleteComment(id)
		ReadableAPI.deleteComment(id)
			.catch((reason) => {
				console.log(`>>> Comment not deleted due to: ${reason}`)
			})
	}

	upVoteComment = (id) => {
		this.props.voteComment({ id, option: "upVote" })
		ReadableAPI.voteComment(id, "upVote")
			.catch((reason) => {
					console.log(`>>> Vote not registered: ${reason}`)
				})
	}

	downVoteComment = (id) => {
		this.props.voteComment({ id, option: "downVote" })
		ReadableAPI.voteComment(id, "downVote")
			.catch((reason) => {
					console.log(`>>> Vote not registered: ${reason}`)
				})
	}

	getCommentProps() {
		let props = {
			id: null,
			voteScore: null,
			author: null,
			body: null,
		}
		if (this.props.comment)
			props = this.props.comment
		return props
	}

	render() {
		const { id, voteScore, author, body } = this.getCommentProps()
		const type = this.props.type
		return (
			<If condition={type === "details"}>
				<Then>
					<section id={id} className="comment">
						<If condition={this.isEditting() === false}>
							<Then>
								<section className="comment-wrapper">
									<section className="comment-vote-score-section">
										<FaAngleUp className="action-button" onClick={() => this.upVoteComment(id)}/>
											<p className="comment-vote-score">{voteScore}</p>
										<FaAngleDown className="action-button" onClick={() => this.downVoteComment(id)}/>
									</section>
									<section className="comment-section">
										<section className="comment-header">
											<section className="comment-header-texts">
												<h4>by </h4><h3>{author}</h3>
											</section>
											<section className="comment-header-buttons">
												<div className="edit-button action-button" onClick={() => this.toggleEditting()}>
													<FaEdit/>
												</div>
												<div className="delete-button action-button" onClick={() => this.deleteComment(id)}>
													<FaClose/>
												</div>
											</section>
										</section>
										<section className="comment-body">
											<p className="comment-body-text">{body}</p>
										</section>
									</section>
								</section>
							</Then>
							<Else>
								<form onSubmit={this.handleCommentUpdate} className="comment-upload-form">
									<section className="comment-wrapper">
										<section className="comment-upload-section">
											<section className="comment-upload-header">
												<section className="comment-header-texts">
													<input className="comment-author-input" type="text" name="author" defaultValue={author} placeholder="My name is..."/>
												</section>
												<section className="comment-header-buttons">
													<div className="cancel-button action-button" onClick={() => this.toggleEditting()}>
														<FaBan/>
													</div>
												</section>
											</section>
											<section className="comment-body">
												<textarea className="comment-body-input" name="body" defaultValue={body} placeholder="Write your commentary here...">
												</textarea>
												<button className="comment-upload-button" type="submit">Send</button>
											</section>
										</section>
									</section>
								</form>
							</Else>
						</If>
					</section>
				</Then>
				<Else>
					<form id="commentUploadForm" className="comment-upload-form" onSubmit={this.handleCommentUpload}>
						<section className="comment-wrapper">
								<section className="comment-upload-section">
									<section className="comment-upload-header">
										<input className="comment-author-input" type="text" name="author" placeholder="My name is..."/>
									</section>
									<section className="comment-body">
										<textarea className="comment-body-input" type="text" name="body" placeholder="Write your comment here...">
										</textarea>
										<button className="comment-upload-button" type="submit">Send</button>
									</section>
								</section>
						</section>
					</form>
				</Else>
			</If>
		)
	}
}

Comment.propTypes = {
	id: PropTypes.string,
	voteScore: PropTypes.number,
	author: PropTypes.string,
	body: PropTypes.string,
}

function mapDispatchToProps(dispatch) {
	return {
		uploadComment: (data) => dispatch(sendComment(data)),
		updateComment: (data) => dispatch(editComment(data)),
		deleteComment: (data) => dispatch(deleteComment(data)),
		voteComment: (data) => dispatch(voteComment(data)),
		updateCommentCount: (data) => dispatch(updateCommentCount(data)),
	}
}

export default connect(null, mapDispatchToProps)(Comment)
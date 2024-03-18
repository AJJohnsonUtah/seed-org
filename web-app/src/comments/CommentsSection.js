import { AddAPhoto, AddComment, Close, Person } from "@mui/icons-material";
import { Avatar, Button, FormHelperText, Grid, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { MyTextField } from "../common/components/MyTextField";

export function EditableComment({ comment, onSaveChanges, getSrcForAttachment, onCancel }) {
  const [commentContent, setCommentContent] = React.useState(comment?.content || "");
  const [attachments, setAttachments] = React.useState(comment?.attachments || []);
  const [inputImageValue, setInputImageValue] = React.useState("");
  function resetComment() {
    setCommentContent(comment?.content || "");
    setAttachments(comment?.attachments || []);
    setInputImageValue("");
  }

  function cancelEditing() {
    resetComment();
    onCancel();
  }
  return (
    <form
      style={{ position: "relative", width: "100%" }}
      onSubmit={(e) => {
        e.preventDefault();
        const commentToSave = { content: commentContent };
        if (comment?._id) {
          commentToSave._id = comment._id;
        }
        onSaveChanges(commentToSave, attachments).then(() => {
          resetComment();
        });
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <Avatar>
            <Person />
          </Avatar>
        </Grid>
        <Grid item>
          <Grid
            container
            spacing={1}
            style={{ backgroundColor: "#DEDEFE", width: "fit-content", padding: 2, borderRadius: 4 }}
          >
            <Grid item style={{ position: "relative" }} container>
              <Grid item>
                <Typography variant="subtitle2">{comment?.user?.displayName || "AJ Johnson"}</Typography>

                <MyTextField
                  label="Comment"
                  value={commentContent}
                  setValue={setCommentContent}
                  multiline
                  required
                  size="small"
                  style={{ minWidth: 500 }}
                />
              </Grid>
              {onCancel && (
                <IconButton type="button" onClick={cancelEditing} style={{ position: "absolute", right: 2, top: 2 }}>
                  <Close />
                </IconButton>
              )}
            </Grid>
            <Grid item>
              <Grid container spacing={1}>
                {attachments.map((attachment, i) => (
                  <Grid item key={i}>
                    <Paper sx={{ p: 0.5 }}>
                      <img
                        src={
                          Boolean(attachment?._id)
                            ? getSrcForAttachment(comment?._id, attachment?._id, attachment?.name)
                            : URL.createObjectURL(attachment)
                        }
                        alt={attachment.name}
                        style={{ maxWidth: 250, maxHeight: 150 }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item container justifyContent={"space-between"}>
              <Grid item>
                <Button
                  startIcon={<AddAPhoto />}
                  onClick={() => document.getElementById("add-image-btn" + comment?._id).click()}
                  variant="contained"
                  size="small"
                >
                  Add Image
                </Button>
                <input
                  id={"add-image-btn" + comment?._id}
                  type="file"
                  accept="image"
                  value={inputImageValue}
                  hidden
                  onChange={(e) => setAttachments([...attachments, e.target.files[0]])}
                />
              </Grid>
              <Grid item>
                <Button type="submit">Save</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}

export function CommentSummary({ comment, onClickEdit, onDelete, getSrcForAttachment }) {
  return (
    <Grid container spacing={2} alignItems="start">
      <Grid item>
        <Avatar>
          <Person />
        </Avatar>
      </Grid>
      <Grid item xs={11}>
        <Grid
          container
          spacing={1}
          style={{ backgroundColor: "#DEDEFE", width: "fit-content", padding: 2, borderRadius: 4 }}
        >
          <Grid item xs={12}>
            <Typography variant="subtitle2">{comment.user?.displayName}</Typography>
            <Typography variant="body2">{comment.content}</Typography>
          </Grid>
          <Grid item xs={12} container spacing={2} alignItems="center">
            {comment.attachments.map((attachment, i) => (
              <Grid item key={i}>
                <Paper sx={{ p: 0.5 }}>
                  <img
                    src={
                      Boolean(attachment?._id)
                        ? getSrcForAttachment(comment?._id, attachment?._id, attachment?.name)
                        : URL.createObjectURL(attachment)
                    }
                    alt={attachment.name}
                    style={{ maxWidth: 250, maxHeight: 150 }}
                  />
                </Paper>
              </Grid>
            ))}
            <Grid item container spacing={3}>
              <Grid item>
                <Tooltip title={moment(comment.createdAt).format("LLL")}>
                  <FormHelperText>
                    {moment(comment.createdAt).fromNow()} {comment.createdAt !== comment.updatedAt && "(edited)"}
                  </FormHelperText>
                </Tooltip>
              </Grid>
              <Grid item>
                <Button size="small" onClick={onClickEdit}>
                  Edit
                </Button>
              </Grid>
              <Grid item>
                <Button
                  size="small"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this comment?")) {
                      onDelete();
                    }
                  }}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default function CommentsSection({ baseId, commentService }) {
  const [comments, setComments] = React.useState(null);
  const [commentIdxUnderEdit, setCommentIdxUnderEdit] = React.useState(null);
  const [showNewComment, setShowNewComment] = React.useState(false);

  const getComments = React.useCallback(() => {
    return commentService.getComments(baseId);
  }, [baseId, commentService]);

  const addComment = React.useCallback(
    (commentToAdd) => commentService.addComment(baseId, commentToAdd),
    [baseId, commentService]
  );

  const editComment = React.useCallback(
    (commentToEdit) => commentService.editComment(baseId, commentToEdit._id, commentToEdit),
    [baseId, commentService]
  );
  const deleteComment = React.useCallback(
    (commentIdToDelete) => commentService.deleteCommentById(baseId, commentIdToDelete),
    [baseId, commentService]
  );

  const addAttachmentToComment = React.useCallback(
    (commentId, attachment) => commentService.addCommentAttachment(baseId, commentId, attachment),
    [baseId, commentService]
  );
  const getSrcForAttachment = React.useCallback(
    (commentId, attachmentId, fileName) =>
      commentService.getSrcUrlForAttachment(baseId, commentId, attachmentId, fileName),
    [baseId, commentService]
  );

  React.useEffect(() => {
    getComments().then((baseWithComments) => setComments(baseWithComments.comments));
  }, [getComments]);

  function addAttachmentsToComment(comment, attachments) {
    const newAttachmentUploads = attachments.filter((a) => !a._id).map((a) => addAttachmentToComment(comment._id, a));
    return Promise.all(newAttachmentUploads);
  }

  return (
    <Grid container spacing={2} sx={{ marginTop: 1 }}>
      <Grid item>
        <Typography variant="h6">Comments</Typography>
      </Grid>
      {comments &&
        comments.map((comment, i) => (
          <Grid item xs={12} key={comment._id}>
            {commentIdxUnderEdit === i ? (
              <EditableComment
                comment={comment}
                onSaveChanges={(commentToSave, attachments) => {
                  return editComment(commentToSave).then((savedBase) => {
                    return addAttachmentsToComment(comment, attachments).then((updatedBases) => {
                      if (updatedBases.length) {
                        comments[i] = updatedBases[updatedBases.length - 1].comments.find(
                          (c) => c._id === commentToSave._id
                        );
                      } else {
                        comments[i] = savedBase.comments.find((c) => c._id === commentToSave._id);
                      }
                      setComments([...comments]);
                      setCommentIdxUnderEdit(null);
                    });
                  });
                }}
                getSrcForAttachment={getSrcForAttachment}
                onCancel={() => setCommentIdxUnderEdit(null)}
              />
            ) : (
              <CommentSummary
                comment={comment}
                onClickEdit={() => setCommentIdxUnderEdit(i)}
                onDelete={() => {
                  return deleteComment(comment._id).then(() => {
                    comments.splice(i, 1);
                    setComments([...comments]);
                  });
                }}
                getSrcForAttachment={getSrcForAttachment}
              />
            )}
          </Grid>
        ))}
      <Grid item>
        {showNewComment ? (
          <EditableComment
            onSaveChanges={(commentToAdd, attachments) => {
              return addComment(commentToAdd).then((updatedBase) => {
                let addedComment = updatedBase.comments[updatedBase.comments.length - 1];
                return addAttachmentsToComment(addedComment, attachments).then((updatedBases) => {
                  if (updatedBases.length) {
                    // get final promise, should be the last uploaded attachment / most up to date version
                    let updatedComments = updatedBases[updatedBases.length - 1].comments;
                    addedComment = updatedComments[updatedComments.length - 1];
                  }
                  setComments([...comments, addedComment]);
                  setShowNewComment(false);
                });
              });
            }}
            onCancel={() => setShowNewComment(false)}
          />
        ) : (
          <Button startIcon={<AddComment />} onClick={() => setShowNewComment(true)}>
            Add Comment
          </Button>
        )}
      </Grid>
    </Grid>
  );
}

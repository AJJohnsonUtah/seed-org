import { AddAPhoto, AddComment, Close, Delete, Edit, MoreHoriz, Person, Save } from "@mui/icons-material";
import {
  Avatar,
  Button,
  CircularProgress,
  FormHelperText,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import React from "react";
import { MyTextField } from "../common/components/MyTextField";

export function displayError(e) {
  alert(e.message);
  console.error(e);
}

export function EditableComment({ comment, onSaveChanges, getSrcForAttachment, onCancel }) {
  const [commentContent, setCommentContent] = React.useState(comment?.content || "");
  const [attachments, setAttachments] = React.useState(comment?.attachments || []);
  const [inputImageValue, setInputImageValue] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const saveCommentButtonId = "save-comment-btn" + (comment?._id ? `-${comment._id}` : "");

  React.useEffect(() => {
    document.getElementById(saveCommentButtonId).scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
  }, [saveCommentButtonId, attachments]);
  function resetComment() {
    setCommentContent(comment?.content || "");
    setAttachments(comment?.attachments || []);
    setInputImageValue("");
    setSaving(false);
  }

  function cancelEditing() {
    resetComment();
    onCancel();
    setSaving(false);
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
        setSaving(true);
        onSaveChanges(commentToSave, attachments)
          .then(() => {
            resetComment();
          })
          .catch(displayError)
          .finally(() => setSaving(false));
      }}
    >
      <Grid container spacing={2}>
        <Grid item flexShrink={1}>
          <Avatar>
            <Person />
          </Avatar>
        </Grid>
        <Grid item flexGrow={1}>
          <Grid container spacing={1} style={{ backgroundColor: "#DEDEFE", padding: 2, borderRadius: 4 }}>
            <Grid item style={{ position: "relative" }} container>
              <Grid item xs={12}>
                <Typography variant="subtitle2">{comment?.user?.displayName || "AJ Johnson"}</Typography>

                <MyTextField
                  label="Comment"
                  value={commentContent}
                  setValue={setCommentContent}
                  multiline
                  required
                  size="small"
                  fullWidth
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
                  onChange={(e) => {
                    setAttachments([...attachments, e.target.files[0]]);
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  id={saveCommentButtonId}
                  type="submit"
                  startIcon={
                    saving ? (
                      <CircularProgress size="small" style={{ height: 16, width: 16 }} color="inherit" />
                    ) : (
                      <Save />
                    )
                  }
                  disabled={Boolean(saving)}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}

export function CommentSummary({ comment, onClickEdit, onDelete, getSrcForAttachment }) {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const commentMenuOpen = Boolean(menuAnchorEl);
  return (
    <Grid container spacing={2} alignItems="start">
      <Grid item flexShrink={1}>
        <Avatar>
          <Person />
        </Avatar>
      </Grid>
      <Grid item flexGrow={1} style={{ width: "calc(100% - 56px)" }}>
        <Grid container spacing={1} style={{ backgroundColor: "#DEDEFE", padding: 2, borderRadius: 4 }}>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography variant="subtitle2">{comment.user?.displayName || "AJ Johnson"}</Typography>
              </Grid>
              <Grid item>
                <Tooltip title={moment(comment.createdAt).format("LLL")}>
                  <FormHelperText>
                    {moment(comment.createdAt).fromNow()} {comment.createdAt !== comment.updatedAt && "(edited)"}
                  </FormHelperText>
                </Tooltip>
              </Grid>
              <Grid item flexGrow={1} />
              <Grid item>
                <IconButton
                  size="small"
                  aria-label="comment actions"
                  id={"comment-menu-btn-" + comment._id}
                  aria-controls={commentMenuOpen ? "comment-menu-" + comment._id : undefined}
                  aria-expanded={commentMenuOpen ? "true" : undefined}
                  onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                >
                  <MoreHoriz />
                </IconButton>
                <Menu
                  id={"comment-menu-" + comment._id}
                  MenuListProps={{
                    "aria-labelledby": "comment-menu-btn-" + comment._id,
                  }}
                  anchorEl={menuAnchorEl}
                  open={commentMenuOpen}
                  onClose={() => setMenuAnchorEl(null)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={onClickEdit}>
                    <ListItemIcon>
                      <Edit />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this comment?")) {
                        onDelete();
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Delete />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
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
  const [loading, setLoading] = React.useState(true);

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
    getComments().then((baseWithComments) => {
      setComments(baseWithComments.comments);
      setLoading(false);
    });
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
                  return editComment(commentToSave)
                    .then((savedBase) => {
                      return addAttachmentsToComment(comment, attachments)
                        .then((updatedBases) => {
                          if (updatedBases.length) {
                            comments[i] = updatedBases[updatedBases.length - 1].comments.find(
                              (c) => c._id === commentToSave._id
                            );
                          } else {
                            comments[i] = savedBase.comments.find((c) => c._id === commentToSave._id);
                          }
                          setComments([...comments]);
                          setCommentIdxUnderEdit(null);
                        })
                        .catch((e) => displayError(e, "addAttachmentsToComment"));
                    })
                    .catch((e) => displayError(e, "editComment"));
                }}
                getSrcForAttachment={getSrcForAttachment}
                onCancel={() => setCommentIdxUnderEdit(null)}
              />
            ) : (
              <CommentSummary
                comment={comment}
                onClickEdit={() => setCommentIdxUnderEdit(i)}
                onDelete={() => {
                  return deleteComment(comment._id)
                    .then(() => {
                      comments.splice(i, 1);
                      setComments([...comments]);
                    })
                    .catch((e) => displayError(e, "deleteComment"));
                }}
                getSrcForAttachment={getSrcForAttachment}
              />
            )}
          </Grid>
        ))}
      {!comments && loading && (
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item flexShrink={1}>
              <Skeleton variant="circular" style={{ width: 40, height: 40 }} />
            </Grid>
            <Grid item flexGrow={1}>
              <Skeleton variant="rectangular" style={{ width: "100%", height: 50 }} />
            </Grid>
          </Grid>
        </Grid>
      )}

      <Grid item xs={12}>
        {showNewComment ? (
          <EditableComment
            onSaveChanges={(commentToAdd, attachments) => {
              return addComment(commentToAdd)
                .then((updatedBase) => {
                  let addedComment = updatedBase.comments[updatedBase.comments.length - 1];
                  return addAttachmentsToComment(addedComment, attachments)
                    .then((updatedBases) => {
                      if (updatedBases.length) {
                        // get final promise, should be the last uploaded attachment / most up to date version
                        let updatedComments = updatedBases[updatedBases.length - 1].comments;
                        addedComment = updatedComments[updatedComments.length - 1];
                      }
                      setComments([...comments, addedComment]);
                      setShowNewComment(false);
                    })
                    .catch((e) => displayError(e, "addAttachmentsToComment - new comment"));
                })
                .catch((e) => displayError(e, "addComment - new comment"));
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

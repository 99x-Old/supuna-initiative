<?php


namespace App\Repository;

use App\Exceptions\RequestDataException;
use App\Model\Comment;
use App\Model\Post;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PostRepository
{
    /**
     * @param $user
     * @param $content
     * @param $reference
     * @param $uuid
     * @return bool
     */
    public function addPost($user, $content, $reference, $uuid)
    {
        $post = new Post();
        $post->content = $content;
        $post->uuid = $uuid;
        $post->user = $user;
        $post->reference = $reference;
        $post->save();
        return $post->id;
    }

    /**
     * @param $postId
     * @return mixed
     */
    public function getPost($postId)
    {
        return Post::where('id', $postId)
            ->with('comments')
            ->first();
    }

    /**
     * @param $uuid
     * @return mixed
     */
    public function getPostByUuid($uuid)
    {
        return Post::where('uuid', $uuid)
            ->with('comments')
            ->first();
    }


    /**
     * Delete Post
     * @param $postId
     * @return bool
     */
    public function deletePost($postId)
    {
        $post = Post::where('uuid', $postId)->first();
        if ($post) {
            Comment::where('post', $post->id)
                ->delete();
        }
        return $post ? $post->delete() : false;
    }

    /**
     * Delete Comment
     * @param $id
     * @return false
     */
    public function deleteComment($id)
    {
        $comment = Comment::find($id);
        return $comment ? $comment->delete() : false;
    }

    /**
     * Save Post
     * @param $reference
     * @return
     */
    public function listPost($reference)
    {
        return Post::where('reference', $reference)
            ->with('comments')
            ->orderBy('updated_at', 'desc')
            ->paginate(15);
    }

    /**
     * Save Comment
     * @param $user
     * @param $content
     * @param $reference
     * @param $uuid
     * @param $postId
     * @return Comment
     * @throws RequestDataException
     */
    public function addComment($user, $content, $reference, $uuid, $postId)
    {
        $post = $postId ? Post::find($postId) : null;
        if (!$post && $postId) {
            throw new RequestDataException("Invalid Post Id!");
        }

        $comment = new Comment();
        $comment->content = $content;
        $comment->uuid = $uuid;
        $comment->user = $user;
        $comment->reference = $reference;
        $comment->post = $postId;
        $comment->save();

        return Comment::find($comment->id);
    }

    /**
     * @param   $reference
     * @param   $postId
     * @return LengthAwarePaginator
     */
    public function listComments($postId, $reference = null)
    {
        if ($postId) {
            $post = Post::where('reference', $reference);
        } else {
            $post = Post::where('id', $postId);
        }
        return $post
            ->orderBy('updated_at', 'desc')
            ->paginate(15);
    }
}

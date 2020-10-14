<?php


namespace App\Service;

use App\Exceptions\RequestDataException;
use App\Model\Comment;
use App\Repository\PostRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Ramsey\Uuid\Uuid;

class PostService
{
    private $repository;

    public function __construct(PostRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Add Post
     * @param User $user
     * @param string $content
     * @param string|null $reference
     * @return object
     */
    public function addPost(User $user, string $content, string $reference = null): object
    {
        $uuid = Uuid::uuid4();

        $id = $this->repository
            ->addPost($user->getUuid(), $content, $reference, $uuid);
        return $this->repository->getPost($id);
    }

    /**
     * Delete Post
     * @param $postId
     * @return bool
     */
    public function deletePost($postId)
    {
        return $this->repository->deletePost($postId);
    }

    /**
     * Add Post
     * @param user
     * @return mixed
     */
    public function list($reference)
    {
        return $this->repository->listPost($reference);
    }

    /**
     * Add Comment
     * @param User $user
     * @param string $content
     * @param string $postId
     * @param string|null $reference
     * @return Comment
     * @throws RequestDataException
     */
    public function addComment(User $user, string $content, string $postId, string $reference = null)
    {
        $uuid = Uuid::uuid4();
        $post = $this->repository->getPostByUuid($postId);
        return $this
            ->repository
            ->addComment($user->getUuid(), $content, $reference, $uuid, $post->id);
    }

    /**
     * Delete Comment
     * @param $commentId
     * @return false
     */
    public function deleteComment($commentId)
    {
        return $this->repository->deleteComment($commentId);
    }

    /**
     * Get Comments
     * @param $postId
     * @param $reference
     * @return LengthAwarePaginator
     */
    public function getComments($postId, $reference = null)
    {
        return $this->repository->listComments($postId, $reference);
    }
}

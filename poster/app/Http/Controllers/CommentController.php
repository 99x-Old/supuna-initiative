<?php

namespace App\Http\Controllers;

use App\Service\PostService;
use App\Service\Response\DefaultResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * @param Request $param
     * @param PostService $postService
     * @return DefaultResponse
     * @throws \Exception
     */
    public function addComment(Request $param, PostService $postService)
    {
        $param->validate([
            'reference' => 'uuid',
            'content' => 'required|min:5',
            'post' => 'uuid',
        ]);

        $user = $this->getUser($param);
        $reference = $param->get('reference');
        $content = $param->get('content');
        $postId = $param->get('post');
        $comment = $postService->addComment($user, $content, $postId, $reference);
        return new DefaultResponse($comment);
    }

    public function deleteComment($commentId, PostService $postService)
    {
        $post = $postService->deleteComment($commentId);
        return new DefaultResponse($post);
    }

    public function listComment(Request $param, PostService $postService)
    {
        $reference = $param->get('reference');
        $postId = $param->get('post');
        $list = $postService->getComments($reference, $postId);
        return new DefaultResponse($list);
    }
}

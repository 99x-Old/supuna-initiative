<?php


namespace App\Http\Controllers;

use App\Service\PostService;
use App\Service\Response\DefaultResponse;
use Exception;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * @param Request $param
     * @param PostService $postService
     * @return DefaultResponse
     * @throws Exception
     */
    public function addPost(Request $param, PostService $postService)
    {
        $param->validate([
            'reference' => 'nullable|min:5',
            'content' => 'required|min:5',
        ]);

        $user = $this->getUser($param);

        $reference = $param->get('reference');
        $content = $param->get('content');

        $post = $postService->addPost($user, $content, $reference);
        return new DefaultResponse($post);
    }

    /**
     * @param $postId
     * @param PostService $postService
     * @return DefaultResponse
     */
    public function deletePost($postId, PostService $postService)
    {
        $post = $postService->deletePost($postId);
        return new DefaultResponse($post);
    }

    /**
     * @param Request $param
     * @param PostService $postService
     * @return DefaultResponse
     */
    public function listPost(Request $param, PostService $postService)
    {
        $reference = $param->get('reference');
        $list = $postService->list($reference);
        return new DefaultResponse($list);
    }
}

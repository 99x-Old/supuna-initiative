<?php

namespace Tests\Unit;

use App\Exceptions\RequestDataException;
use App\Model\Comment;
use App\Model\Post;
use App\Repository\PostRepository;
use App\Service\PostService;
use App\Service\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Tests\TestCase;

class PostServiceTest extends TestCase
{
    protected $user, $shop;


    function setUp(): void
    {
        parent::setUp();
        $userData = new User();
        $userData->setUuid('0f63071b-4eb2-4cac-b7a2-007ffb9f3842');
        $userData->setFirstName('Test');
        $userData->setLastName('User');
        $userData->setRole([]);

        $this->user = $userData;

    }

    public function testAddPost()
    {
        $repo = new PostRepository();
        $postService = new PostService($repo);


        $reference = 'test-reference';
        $content = 'test post';

        $post = $postService->addPost($this->user, $content, $reference);
        $this->assertInstanceOf(Post::class, $post);
        $this->assertEquals($reference, $post->reference);
        $this->assertEquals($content, $post->content);
    }

    /**
     * @throws RequestDataException
     */
    public function testAddComment()
    {
        $repo = new PostRepository();
        $postService = new PostService($repo);

        $reference = 'test-post-reference';
        $content = 'test post';

        $post = $postService->addPost($this->user, $content, $reference);

        $reference = 'test-comment-reference';
        $content = 'test comment';
        $comment = $postService->addComment($this->user, $content, $post->uuid, $reference);

        $this->assertInstanceOf(Comment::class, $comment);
        $this->assertEquals($reference, $comment->reference);
        $this->assertEquals($content, $comment->content);
    }

    public function testDeleteComment()
    {
        $repo = new PostRepository();
        $postService = new PostService($repo);

        $reference = 'test-post-reference';
        $content = 'test post';

        $post = $postService->addPost($this->user, $content, $reference);

        $reference = 'test-comment-reference';
        $content = 'test comment';
        $comment = $postService->addComment($this->user, $content, $post->uuid, $reference);

        $this->assertInstanceOf(Comment::class, $comment);
        $this->assertEquals($reference, $comment->reference);
        $this->assertEquals($content, $comment->content);

        $comment = $postService->deleteComment($comment->id);
        $this->assertTrue($comment);

    }

    public function testGetComments()
    {
        $repo = new PostRepository();
        $postService = new PostService($repo);

        $reference = 'test-post-reference';
        $content = 'test post';

        $post = $postService->addPost($this->user, $content, $reference);

        $reference = 'test-comment-reference';
        $content = 'test comment';
        $comment = $postService->addComment($this->user, $content, $post->uuid, $reference);

        $this->assertInstanceOf(Comment::class, $comment);
        $this->assertEquals($reference, $comment->reference);
        $this->assertEquals($content, $comment->content);

        $comments = $postService->getComments($reference);
        $this->assertInstanceOf(LengthAwarePaginator::class, $comments);

    }

    public function testList()
    {
        $repo = new PostRepository();
        $postService = new PostService($repo);

        $reference = 'test-post-reference';
        $content = 'test post';

        $post = $postService->addPost($this->user, $content, $reference);

        $this->assertInstanceOf(Post::class, $post);
        $this->assertEquals($reference, $post->reference);
        $this->assertEquals($content, $post->content);

        $posts = $postService->list($reference);
        $this->assertInstanceOf(LengthAwarePaginator::class, $posts);
        $this->assertTrue($posts->total() > 0);

    }

    public function testDeletePost()
    {
        $repo = new PostRepository();
        $postService = new PostService($repo);

        $reference = 'test-post-reference';
        $content = 'test post';

        $post = $postService->addPost($this->user, $content, $reference);

        $this->assertInstanceOf(Post::class, $post);
        $this->assertEquals($reference, $post->reference);
        $this->assertEquals($content, $post->content);

        $post = $postService->deletePost($post->uuid);
        $this->assertTrue($post);
    }
}

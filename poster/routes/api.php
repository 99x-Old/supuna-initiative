<?php

use Illuminate\Support\Facades\Route;

Route::any('/', function (){
    return 'Poster is up!';
});
Route::post('/post', "PostController@addPost");
Route::get('/post', "PostController@listPost");
Route::delete('/post/{id}', "PostController@deletePost");

Route::post('/comment', "CommentController@addComment");
Route::get('/comment', "CommentController@listComment");
Route::delete('/comment/{id}', "CommentController@deleteComment");

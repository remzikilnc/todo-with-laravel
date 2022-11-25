<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//GET ->


Route::get('/', [\App\Http\Controllers\Todos::class, 'index'])->name('viewTodo');
Route::post('/create/', [\App\Http\Controllers\Todos::class, 'create'])->name('createTodo');
Route::post('/update/{id}', [\App\Http\Controllers\Todos::class, 'update'])->name('updateTodo');
Route::get('/delete/{id}', [\App\Http\Controllers\Todos::class, 'destroy'])->name('deleteTodo');

Auth::routes();

Route::get('/token', function (Request $request) {
    $token = $request->session()->token();

    $token = csrf_token();

});

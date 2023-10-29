@extends('layouts.user')
@section('title','Todo')
@section('child-todo-title','')

@section('page-style')
    @vite('resources/sass/main.sass')
@endsection
@section('content')
    <div id="status-bag" class="alert text-center mb-2" role="alert" style="opacity: 0;"></div>
<section class="todo_list">
    <div id="list-todo-block" class="todo-group">
        <table class="todo_list_table table table-borderless text-light d-flex align-items-center justify-content-center">
            <tr>
                <th>Todo</th>
                <th>Operations</th>
            </tr>
        @foreach($todoList as $todo)
            <tr data-id="{{$todo['id']}}" class="table-content">
                <td class="@if($todo['status'] == 1) text-success @else text-danger @endif" data-status="@if($todo['status'] == 1) 1 @else 0 @endif">{{$todo['todo']}}</td>
                <td class="justify-content-between d-flex">
                    <button class="btn btn-danger del-todo" data-delete="@if($todo){{route('deleteTodo', $todo['id'])}}@endif" >Delete</button>
                    <button class="btn btn-primary modify-todo" data-update="@if($todo){{route('updateTodo', $todo['id'])}}@endif">Modify</button>
                </td>
            </tr>
        @endforeach
        </table>
        <div class="d-grid">
            <button class="btn btn-primary todo-add-btn" data-url="{{route('createTodo')}}">Ekle</button>
        </div>
    </div>
    <div id="cr-todo-block" style="opacity:0; visibility:hidden" class="shadow-none todo-group position-fixed overflow-hidden">
            <section class="d-block table table-borderless text-light px-5 pt-5 justify-content-center">
                <input id="csrf-token-field" type="hidden" name="_token" value="{{csrf_token()}}"/>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Todo</span>
                    </div>
                    <input type="text" name="todo-cr-text" class="form-control todo-group-input">
                </div>
                <div class="input-group mb-3">
                    <div class="input-group-append">
                        <label class="input-group-text" for="todo-cr-status">Status</label>
                    </div>
                    <select name="todo-cr-status" class="custom-select todo-group-input">
                        <option value="1">Complated</option>
                        <option value="0" selected>Not Complated</option>
                    </select>
                </div>
            </section>
        <div id="todo-group-buttons" class="d-flex justify-content-between">
            <button class="btn-danger btn todo-cr-close">Çık</button>
            <button class="btn-primary btn todo-cr-button" data-url="{{route('createTodo')}}">Kaydet</button>
        </div>
    </div>
    <div id="modify-todo-block" style="opacity:0; visibility:hidden" class="shadow-none todo-group position-fixed overflow-hidden">
        @if($errors->has('TodoCreateError'))
            <strong>{{$errors->first('TodoCreateError')}}</strong>
        @endif
        <div class="info_bag d-flex justify-content-center">
            <div id="update-bag" class="d-none align-items-center justify-content-center p-3 fw-semibold mt-5 border-4"></div>
        </div>
        <section class="d-block table table-borderless text-light px-5 pt-5 justify-content-center">
            <div class="input-group mb-3 bg-dark">
                <div class="input-group-prepend">
                    <span class="input-group-text">Todo</span>
                </div>
                <input type="text" name="todo-update-text" class="form-control">
            </div>
            <div class="input-group mb-3 justify-content-center">
                <div class="form-check form-switch">
                    <label class="form-check-label" for="flexSwitchCheckDefault">Status
                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" name="todo-update-status">
                    </label>
                </div>
            </div>
        </section>
        <div id="todo-group-buttons" class="d-flex justify-content-between">
            <button class="btn-danger btn update-cancel-btn">Cancel</button>
            <button id="update-submit-btn" class="btn-primary btn">Save</button>
        </div>
    </div>
</section>
@endsection
@section('page-script')
    @vite('resources/js/todo/main.js')
@endsection


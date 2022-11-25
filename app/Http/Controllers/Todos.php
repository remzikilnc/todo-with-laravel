<?php

namespace App\Http\Controllers;

use App\Http\Requests\TodoRequest;
use App\Http\Requests\TodoUpdateRequest;
use App\Models\Todo;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Console\Input\Input;

class Todos extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Application|Factory|View
     */
    public function index()
    {
        $todoList = Todo::query()->get('*');
        return view('todo.todo', compact('todoList'));
    }

    /**
     * Show the form for creating a new resource.
     * @return JsonResponse
     *
     * @throws \Exception
     */
    public function create(TodoRequest $request)
    {
        if ($request->isMethod('POST')) {
            $data = Todo::create([
                'todo' => $request['todoText'],
                'status' => $request['todoStatus'],
            ]);
            return response()->json([
                'message' => "New Todo have been added.",
                'status' => 201,
                'id' => $data->id,
                'deleteUrl' => route('deleteTodo',$data->id),
                'updateUrl' => route('updateTodo',$data->id),
            ], 201);
        }

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function update(TodoRequest $request, int $id): JsonResponse
    {
        $todo = Todo::find($id);
        $todo->todo = $request['todoText'];
        $todo->status = $request['todoStatus'];
        $todo->save();

        return response()->json([
            'message' => 'Todo Updated.',
            'status' => 201
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(int $id)
    {
        if ($id > 0) {
            Todo::destroy($id);
        }
        return response('Success!', 200);
    }
}

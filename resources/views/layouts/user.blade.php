<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>@yield('title') @if(trim($__env->yieldContent('child-todo-title'))) - @yield('child-todo-title') @endif</title>
    @stack('before-style')
    @if(trim($__env->yieldContent('page-style')))
        @yield('page-style')
    @endif
    @stack('after-style')
    @vite('resources/sass/main.sass')
</head>
<body>
<div class="container">
    @yield('content')
</div>

@stack('before-scripts')
@if (trim($__env->yieldContent('page-script')))
    @yield('page-script')
@endif
@stack('after-scripts')
</body>
</html>


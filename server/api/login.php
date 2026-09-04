<?php
header('Content-Type: application/json; charset=utf-8');
$input=json_decode(file_get_contents('php://input'),true) ?: [];
$user=$input['username']??''; $pass=$input['password']??'';
if($user==='admin' && $pass==='123456'){ echo json_encode(['token'=>'demo-admin-token']); } else { http_response_code(401); echo json_encode(['error'=>'بيانات الدخول غير صحيحة']); }
?>
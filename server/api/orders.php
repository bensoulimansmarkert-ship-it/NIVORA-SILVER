<?php
header('Content-Type: application/json; charset=utf-8');
if($_SERVER['REQUEST_METHOD']!=='POST'){echo json_encode(['orders'=>[]]);exit;}
$body=json_decode(file_get_contents('php://input'),true) ?: [];
if(empty($body['customerName'])||empty($body['phone'])||empty($body['items'])){http_response_code(400);echo json_encode(['error'=>'بيانات الطلب ناقصة']);exit;}
$file=__DIR__.'/../data/orders.json';$orders=file_exists($file)?json_decode(file_get_contents($file),true):[];
$id='NV-'.time();$body['id']=$id;$body['status']='new';$body['paymentStatus']='pending';$body['createdAt']=date('c');$orders[]=$body;file_put_contents($file,json_encode($orders,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));http_response_code(201);echo json_encode(['ok'=>true,'id'=>$id]);
?>
<?php
header('Content-Type: application/json; charset=utf-8');
$orders=json_decode(@file_get_contents(__DIR__.'/../data/orders.json'),true)?:[];$sales=0;$cost=0;foreach($orders as $o){$sales+=(float)($o['total']??0);$cost+=(float)($o['costTotal']??0);}echo json_encode(['sales'=>$sales,'cost'=>$cost,'expenses'=>0,'profit'=>$sales-$cost,'orders'=>count($orders)]);
?>
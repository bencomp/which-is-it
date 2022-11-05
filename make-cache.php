<?php
$source = __DIR__ . '/app/assets/' ;
$results = json_decode(file_get_contents('./app/objects.json'));


foreach ($results->results->bindings as &$binding) {
  $img = $binding->imgS->value;
  if(!is_dir($source)) mkdir($source);
  parse_str(parse_url($img)['query'], $q);
  $target = $source . basename($q['filename']);
  if (!file_exists($target)) copy($img, $target);
  $binding->imgS->value = str_replace(__DIR__  .'/', '', $target);
}

echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
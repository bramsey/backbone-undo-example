require 'sinatra'
require 'json'

@@data = []
@@count = 0

get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/items' do
  content_type :json
  puts "get data: #{@@data}"
  @@data.to_json
end

post '/items' do
  content_type :json
  
  if params[:model]
    item = JSON.parse(params[:item]).merge('id' => @@count += 1 )
  else
    bod = request.body.read
    item = JSON.parse(bod).merge('id' => @@count += 1)
  end
  @@data << item
  item.to_json
end

put '/items/:id' do
  content_type :json
  bod = JSON.parse(request.body.read)
  index = @@data.index {|item| item['id'] == params[:id].to_i}
  @@data[index] = bod if index
  bod.to_json
end

delete '/items/:id' do
  content_type :json
  @@data.delete_if {|item| item['id'] == (params[:id].to_i)}
  @@data.to_json
end
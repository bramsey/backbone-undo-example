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
  puts "params: #{params}"
  if params[:model]
    item = JSON.parse(params[:item]).merge(:id => @@count += 1 )
  else
    bod = request.body.read
    puts "body: #{bod}"
    item = JSON.parse(bod).merge(:id => @@count += 1)
  end
  @@data << item
  puts "data: #{@@data}"
  item.to_json
end

put '/items/:id' do
  content_type :json
  bod = JSON.parse(request.body.read)
  puts "put params: #{params[:id].to_i} | #{bod}"
  #@@data[params[:id].to_i] = bod
  bod.to_json
end

delete '/items/:id' do
  content_type :json
  puts "delete params: #{params}"
  @@data.delete_if {|item| item[:id] == (params[:id].to_i)}
  puts "delete data: #{@@data}"
end
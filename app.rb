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
import flask, flask.views
import os
from flask.ext.socketio import SocketIO, emit
from flask import Flask, render_template, session, request
import random
from yahoo_finance import Share
from datetime import datetime, timedelta
import math
from threading import Timer
import time
import urllib2


app = flask.Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.debug = True
socketio = SocketIO(app)



@app.route('/')
def home():
    return render_template('index.html')


@socketio.on('get_stock')
def printName(stock_name):
	print stock_name
	prices,predictions = bollinger(stock_name)
	print "SENDING THESE:"
	print prices
	print predictions

	# print ("SENDING PRICES PREDICTS" + prices +" "+ predictions)
	emit("prices", prices)
	emit("predictions", predictions)





def isValidSymbol(self, symbol):
	temp = Stock(symbol)
	return temp.get_open()!=None


def getSymbol(string):
	req = urllib2.Request('http://finance.yahoo.com/q?s='+string)
	res = urllib2.urlopen(req)
	finalurl = res.geturl()
	res.close()
	return finalurl[finalurl.index('=')+1:]

def ema(base):
    alpha = 0.99
    sum = 0
    weight = 1.0
    for b in base:
        sum = sum + b*weight
        weight = weight*alpha
    return sum/(len(base))

def stdev(vals, ema):
	length = len(vals)
	m = ema
	total_sum = 0
	for i in range(length):
	    total_sum += (vals[i]-m)**2
	return math.sqrt(total_sum/length)


def bollinger(stocks): 
	print stocks

	prices =[]
	predictions=[]
	for stock in stocks:
		stock = stock.encode("ascii")
		y = Share(stock)
		price = y.get_price()
		price = float(price) 
		now = datetime.now()
		N_days = datetime.now() - timedelta(days=3)
		dateToday = str(now.year)+'-'+str(now.month)+'-'+str(now.day)
		dateNdays = str(N_days.year)+'-'+str(N_days.month)+'-'+str(N_days.day)

		history = y.get_historical(dateNdays, dateToday)
		trail = []
		for data in history:
			a = data.get('Adj_Close')
			trail.append(float(a))
		avg = ema(trail)
		std = stdev(trail, avg)
		print std
		lower = avg - std
		if(lower<0):
			lower = 0;
		upper = avg + std
		y.refresh()
		prices.append(price)

		if(price < lower):
			predictions.append("BUY")
			# return str(stock) + " : " + "BUY"
		elif(price > upper):
			predictions.append("SELL")
			# return str(stock) + " : " + "SELL"
		else:
			predictions.append("HOLD")
			# return str(stock) + " : " + "HOLD"
		# print "price: " + str(price) + ', upper: ' +str(upper) + ", lower: " + str(lower)
	return prices,predictions


if __name__ == '__main__':
	# prices, predictions = bollinger(["MSFT","FB","GOOG"])
	# print(predictions)
	# print(prices)
    socketio.run(app)
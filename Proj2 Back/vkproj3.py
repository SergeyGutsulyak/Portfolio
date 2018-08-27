from flask import Flask, render_template,redirect, jsonify
from flask import request
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired
from datetime import datetime
from vkForms import CityForm, GroupForm
from vkDB import *
from vkfun import addGroupToDb,addCityToDb, refreshUsersGroup,scanGroup, refreshStats,testDublicate
import _thread as thread
from os import system
from sqlalchemy import desc 
import time
import json
import pickle
#import vkfun
import vk_api

vk=[]

#app=Flask(__name__)

@app.route('/',methods=['GET','POST'])
def index():
    #return render_template('base4.html',menu=menu)
    return render_template('index.html')
    #return render_template('base5.html')
#@app.route('/posts')
#def posts():
    #return render_template('posts.html',menu=menu)

@app.route('/users',methods=['POST'])
def users_render():
    requestData=json.loads(request.data)
    # print(json.loads)
    idGroup=requestData['idGroup']
    a={'data':{}}
    # for el in User.query.offset(0).limit(1000):
        # a['data'][el.id]=el.toJSON()
    for el in MemberDel.query.filter_by(group_id=idGroup).order_by(desc(MemberDel.date)).limit(100):
        # print(el)
        a['data'][str(el.user_id)+'_del']=el.toJSON()
    for el in MemberAdd.query.filter_by(group_id=idGroup).order_by(desc(MemberAdd.date)).limit(100):
        # print(el.toJSON())
        a['data'][str(el.user_id)+'_add']=el.toJSON()
    #return jsonify(User.query.first().toJSON())
    #print(jsonify(a))
    time.sleep(3)
    return jsonify(a),201,{'Access-Control-Allow-Origin':'*','Content-Type': 'application/json'}


@app.route('/groups',methods=['POST'])
def groups_render():
    a={'data':{}}
    for el in Group.query.offset(0).limit(1000):
        # print(el.toJSON())
        a['data'][el.id]=el.toJSON()
    print(jsonify(a))
    time.sleep(3)
    return jsonify(a),201,{'Access-Control-Allow-Origin':'*','Content-Type': 'application/json'}

@app.route('/addgroup',methods=['POST'])
def addgroup():
    a={'data':'OK'}
    requestData=json.loads(request.data)
    onScan=0
    if requestData['on_scan']:
        onScan=1
    if (addGroupToDb(vk,ids=[requestData['screen_name']],_onScan=onScan)):
        a={'statusOK':True,'data':{}}
        #В ответ новый список групп
        for el in Group.query.offset(0).limit(1000):
            a['data'][el.id]=el.toJSON()
    else:
       a={'statusOK':False}
    return jsonify(a),201,{'Access-Control-Allow-Origin':'*','Content-Type': 'application/json'}


def auth_vk():
    global vk
    vk_session = vk_api.VkApi(token="Здесь нужно вставить токен приложения вк")
    vk = vk_session.get_api()
    
if __name__=='__main__':
    # testDublicate()
    # print(refreshStats(148211585))
    #print('Пауза перед запуском сканирования')
    #time.sleep(10)
    # auth_vk()
    # a=thread.start_new_thread(scanGroup,(vk,))
    #print('Печать потока')
    #print(a)
    app.config['SECRET_KEY']='bfjlkjsdfgcdfgsdh'
    app.run(debug=True)
    # manager.run()  
    

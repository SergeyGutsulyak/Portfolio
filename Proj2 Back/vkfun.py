import vk_api
from vkDB import *
from math import ceil
from datetime import datetime
import random
import time
from os import system

qwst={#'day':{'year':0,'month':0,'day':1,'hour':0,'minute':0,'second':0},
    #   'week':{'year':0,'month':0,'day':7,'hour':0,'minute':0,'second':0},
    #   'month':{'year':0,'month':1,'day':0,'hour':0,'minute':0,'second':0},
      'year':{'year':1,'month':0,'day':0,'hour':0,'minute':0,'second':0}
      }

def refreshStats(idGroup):
    stats={}
    stats['added']={}
    stats['deleted']={}
    gr=Group.query.get(idGroup)
    stats['user_count']=gr.gr_users.count()
    for key in qwst.keys():
        dt=datetime.now()
        year=qwst[key].get('year',0)
        month=qwst[key].get('month',0)
        day=qwst[key].get('day',0)
        hour=qwst[key].get('hour',0)
        minute=qwst[key].get('minute',0)
        second=qwst[key].get('second',0)
        dt=subtractDateTime(dt,year=year,month=month,day=day,hour=hour,minute=minute,second=second)
        cnt=User.query.join(MemberDel,MemberDel.user_id==User.id).filter(MemberDel.group_id==idGroup).filter(MemberDel.date>dt).count()
        users=User.query.join(MemberDel,MemberDel.user_id==User.id).filter(MemberDel.group_id==idGroup).filter(MemberDel.date>dt).all()
        # print(users[2].toJSON())
        stats['deleted'][key]=cnt
        cnt=User.query.join(MemberAdd,MemberAdd.user_id==User.id).filter(MemberAdd.group_id==idGroup).filter(MemberAdd.date>dt).count()
        users=User.query.join(MemberAdd,MemberAdd.user_id==User.id).filter(MemberAdd.group_id==idGroup).filter(MemberAdd.date>dt).all()
        # print(users[1])
        stats['added'][key]=cnt
    return stats   


def start_session(login=None,password=None,token=None):
    if token!=None:
        vk_session=vk_api.VkApi(token=token)
        try:
            vk_session.auth()
        except vk_api.AuthError as error_msg:
            print(error_msg)
            return None,error_msg
        print('Авторизация прошла успешно')
        return vk_session,'Авторизация прошла успешно'
    if login!=None and password!=None:
        vk_session=vk_api.VkApi(login,password)
        try:
            vk_session.auth()
        except vk_api.AuthError as error_msg:
            print(error_msg)
            return None,error_msg
        return vk_session,'Авторизация прошла успешно'
    return None, 'Не введены данные'
        
def tostr(mass):
    s=''
    for el in mass:
        s=s+str(el)+','
    s=s[:-1]
    return s

def addCityToDb(el):
    if 'city' in el:
        #print(el)
        #print( City.query.filter_by(id=el['city']['id']).count())
        if City.query.filter_by(id=el['city']['id']).count()==0:
            db.session.add(City(id=el['city']['id'],title=el['city']['title']))
            db.session.commit()

def addCountryToDb(el):
    if 'country' in el:
        if Country.query.filter_by(id=el['country']['id']).count()==0:
            db.session.add(Country(id=el['country']['id'],title=el['country']['title']))
            db.session.commit()

def addUniversityToDb(el):
    if 'university' in el:
        if University.query.filter_by(id=el['university']).count()==0:
            db.session.add(University(id=el['university'],name=el['university_name']))
            db.session.commit()

def addFacultyToDb(el):
    if 'faculty' in el:
        if Faculty.query.filter_by(id=el['faculty']).count()==0:
            db.session.add(Faculty(id=el['faculty'],name=el['faculty_name'],university_id=el['university']))
            db.session.commit()

def addGroupToDb(vk,ids,_onScan=0,_periodScan=1440):
    #добавляет группы в БД по ID или коротким ссылыкам
    #передаются в виде строки через запятую
    try:
        grps=vk.groups.getById(group_ids=ids,fields=Group.fields)
    except:
        return 0
        #если города нет в таблице добавить
    for gr in grps:

        addCityToDb(gr)
        addCountryToDb(gr)

        #если группы нет базе добивить
        if Group.query.filter_by(id=gr['id']).count()==0:
            #print(gr[0])
            db.session.add(Group(id=gr['id'],\
                name=gr['name'],\
                screen_name=gr.get('screen_name',''),\
                is_admin=gr.get('is_admin',100),\
                is_closed=gr.get('is_closed',100),\
                type_gr=gr.get('type_gr','unknown'),\
                deactivated=gr.get('deactivated','OK'),\
                photo_50=gr.get('photo_50',''),\
                photo_100=gr.get('photo_100',''),\
                photo_200=gr.get('photo_200',''),\
                city_id=gr.get('city',{}).get('id',0),\
                country_id=gr.get('country',{}).get('id',0),\
                contacts=gr.get('contacts',{}),\
                description=gr.get('description',''),\
                on_scan=_onScan,\
                period_scan=_periodScan,\
                last_scan=datetime(year=1971, month=1, day=2),\
                start_scan_time=datetime.now(),\
                )) 
            db.session.commit()
        return 1
def addUserToDb(vk,ids):
    countUser=len(ids)
    if countUser>1000:
        n=ceil(countUser/1000)
        for i in range(0,n):
            print('Итерация '+str(i))
            time.sleep(20)
            ids2=ids[i*1000:(i+1)*1000]
            addUserToDb1000(vk,ids2)
    else:
        addUserToDb1000(vk,ids)

def addUserToDb1000(vk,ids):

    #ids в виде списка, преобразовать в строку
    strIds=''
    for eId in ids:
        strIds+=str(eId)+','
    strIds=strIds[0:-1]
    #учесть лимит на 1 запрос в ВК
    try:
        users=vk.users.get(user_ids=strIds,fields=User.fields)
    except:
        print('Ошибка получения информации о пользователях')
        return
    #по заданным id добавляет пользователей
    for user in users:
        #print(user)
        addCityToDb(user)
        addCountryToDb(user)
        addUniversityToDb(user)
        addFacultyToDb(user)
#!добавить ссылку на фотку
        if User.query.filter_by(id=user['id']).count()==0:
            print("Пользователя в БД:")
            print(user)
            if user.get('deactivated','OK')=='OK':
                db.session.add(User(id=user['id'],\
                first_name=user.get('first_name',''),\
                last_name=user.get('last_name',''),\
                deactivated=user.get('deactivated','OK'),\
                #activities=user.get('activities',''),\
                bdate=user.get('bdate',''),\
                city_id=user.get('city',{}).get('id',''),\
                skype=user.get('connections',{}).get('skype',''),\
                facebook=user.get('connections',{}).get('facebook',''),\
                twitter=user.get('connections',{}).get('twitter',''),\
                livejournal=user.get('connections',{}).get('livejournal',''),\
                instagram=user.get('connections',{}).get('instagram',''),\
                followers_count=user.get('followers_count',0),\
                mobile_phone=user.get('mobile_phone',''),\
                home_phone=user.get('home_phone',''),\
                university_id=user.get('university',0),\
                faculty_id=user.get('faculty',0),\
                graduation=user.get('graduation',0),\
                domain=user['domain'],\
                home_town=user.get('home_town','не указан'),\
                last_seen_time=user.get('last_seen',{}).get('time',0),\
                last_seen_platform=user.get('last_seen',{}).get('platform',0),\

                sex=user.get('sex',0),\
                relation=user.get('relation',-1),\
                relation_partner=user.get('relation_partner',{}).get('id',0),\
                maiden_name=user.get('maiden_name',''),\
                nickname=user.get('nickname',''),\
                occupation_type=user.get('occupation',{}).get('type',''),\
                occupation_id=user.get('occupation',{}).get('id',''),\
                occupation_name=user.get('occupation',{}).get('name',''),\
                site=user.get('site','#'),\
                photo_50=user.get('photo_50',''),\
                photo_100=user.get('photo_100',''),\
                photo_200=user.get('photo_200',''),\
                ))
            else:
                db.session.add(User(id=user['id'],deactivated=user['deactivated']))
                
        db.session.commit()
        #break

def refreshUsersGroup(vk,idGroup,typeSort="time_asc"):
    #передается id группы, в базу запрос о статусе администратора
    #если статус админ, то выполняется с сортировкой по времени вступления
    gr=Group.query.get(idGroup)
    #print(gr)
    if gr.is_admin==1:
        tSort=typeSort
    else:
        tSort=''
    now = datetime.now() 
    try:   
        responseFromVk=vk.groups.getMembers(group_id=idGroup,sort=tSort) 
    except:
        print('Ошибка запроса получения участников групп') 
        return
    membersFromVk=responseFromVk['items']    
    #количество участников может быть больше 1000
    if responseFromVk['count']>1000:
        n=ceil(responseFromVk['count']/1000)
        for i in range(1,n):
            time.sleep(3)
            try:
                responseFromVk=vk.groups.getMembers(group_id=idGroup,sort=tSort,offset=i*1000)
            except:
                print('Ошлибка чтения участников групп на итерации '+str(i))
                return
            membersFromVk+=responseFromVk['items']
    #получить из БД список участников текущей группы
    #gr=Group.query.get(idGroup)
    #print(gr.gr_users.all())
    
    #gr.gr_users.all().user_id
    #список ID, которые сохранены в базе и состоят в группе
    membersFromDB=[]
    for memb in gr.gr_users.all():
        membersFromDB.append(memb.id)
    #print(membersFromDB)
    #преобразование в множество
    setMembersFromVk=set(membersFromVk)
    setmembersFromDB=set(membersFromDB)
    allUsersFromDB=[]
    for user in User.query.all():
        allUsersFromDB.append(user.id)
    
    setAllUsersFromDB=set(allUsersFromDB)
    #пользователи которых нет в базе
    setUsersToAdd=setMembersFromVk-setAllUsersFromDB
    print('Новые пользователи:')
    print(setUsersToAdd)
    usersToAdd=list(setUsersToAdd)
    #добавить в базу
    addUserToDb(vk=vk,ids=usersToAdd)

    newUsers=setMembersFromVk-set(membersFromDB)
    #print(newUsers)
    #добавление новых пользователей в группу
    #print(newUsers)
    #print(gr.id)
    for userId in newUsers:
        curUser=User.query.get(userId)
        print('Попытка добавить нового пользователя с  ID: '+str(userId))
        print(curUser)
        if  gr.gr_users.filter_by(id=curUser.id).count()<1:
            print('Пользователь в списке новых:')
            print(curUser)
            gr.gr_users.append(curUser)
            db.session.add(MemberAdd(group_id=gr.id,user_id=curUser.id,date=now))

    #удаление ушедших
    oldUsers=set(membersFromDB)-setMembersFromVk
    print('Пользователи к удалению:')
    print(oldUsers)
    #print(oldUsers)
    for userId in oldUsers:
        #print(userId)
        curUser=User.query.get(userId)
        print('Удаляется пользователь:')
        print(curUser)
        #print(curUser)
        gr.gr_users.remove(curUser)
        db.session.add(MemberDel(group_id=gr.id,user_id=curUser.id,date=now))
        #db.session.commit()
    gr.last_scan=now
    db.session.add(gr)    
    db.session.commit()
#установка группы на скнирование    
def setGroupOnScan(idGr,period=1440):
    gr=Group.query.get(idGr)
    gr.on_scan=1
    gr.period_scan=period
    db.session.add(gr)    
    db.session.commit()

#убрать сканирование
def removeGroupFromScan(idGr):
    gr=Group.query.get(idGr)
    gr.on_scan=0
    db.session.add(gr)    
    db.session.commit()    

def scanGroup(vk):
       
    print('Сканирование групп запущено')
    system('chcp 1251')
    time.sleep(3)
    while 1:
        now=datetime.now()
        for gr in Group.query.filter_by(on_scan=1).all():
            
            c=now-gr.last_scan
            #print(c)
            #print(c.days*1440+c.seconds/60)
            #print(str(gr.name.encode('cp1251'),encoding='cp1251'))
            #print(gr.name)
            
            #print(gr.group_id)
            #print(gr.name)
            #print('Идет сканирование группы:id=%s, название:%s'%(gr.group_id,gr.name))
            
            if (c.days*1440+c.seconds/60)>gr.period_scan:
                #system('chcp 1251')
                print(gr.id)
                print(gr.name)
                print('Идет сканирование группы:id=%s, название:%s'%(gr.id,gr.name))
                #system('chcp 866')
                refreshUsersGroup(vk=vk,idGroup=gr.id)
                time.sleep(random.randint(1,10))
        time.sleep(120)
    print('Сканирование групп отсановлено')
#сделать функцию обанвляющие информацию о группах
#сделать функцию обанвляющие информацию о пользователях
#сделать отчеты по группам с выбором даты, подумать с страницах

#def getStatGroup(idGruop):
    #dateNow=datetime.now() #текущая дата
    #stampDateTimeNow=dateNow.timestamp()
    #dateYesterdayStart=dateNow.replace()
    #a.replace(day=10)
    #timestamp()          #в секундах с начала эпохи
    #datetime.fromtimestamp(c)  #Обратно в timestamp

def culcDayInMonth(tm_year,tm_month):
    #высчитывет количество дней в месяце в заданном году
    startData=datetime(year=tm_year,month=tm_month,day=1)
    endData=datetime(year=tm_year,month=tm_month+1,day=1)
    raz=endData-startData
    return raz.days


def subtractDateTime(dtm,year=0,month=0,day=0,hour=0,minute=0,second=0):
    #вычитаются от дней до секунд
    tmNew=datetime.fromtimestamp(dtm.timestamp()-(second+minute*60+hour*60*60+day*60*60*24))

    #в формат дата время
    tplTmNew=tmNew.timetuple()
    
    Y=tplTmNew.tm_year  #год
    M=tplTmNew.tm_mon #месяц

    Y-=year
    if (M-month)<=0:
        Y-=1
        M=M+12-month
    else:
        M-=month
    
    return tmNew.replace(year=Y,month=M)

def testDublicate():
    for gr in Group.query.all():
        print('Группа:'+str(gr.id))
        for usr in gr.gr_users.all():
            if gr.gr_users.filter_by(id=usr.id).count()>1:
                print('Обнаружен дубликат ID:'+str(usr.id))
    # gr=Group.query.get(150467491)
    # u=gr.gr_users.filter_by(id=36257924).count()
    # curUser=User.query.get(36257924)
    # gr.gr_users.remove(curUser)
    #a=members.select(user_id=36257924)
    # print(members.delete)
    #help(members.c.items)
    # db.session.add(gr)    
    # db.session.commit()
    #u=gr.gr_users.filter_by(id=36257924).count()
    #print(u)
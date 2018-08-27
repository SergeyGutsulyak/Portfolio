from flask_sqlalchemy import SQLAlchemy
import os
from flask import Flask
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
from datetime import datetime

app=Flask(__name__)



#app.config['SQLALCHEMY_DATABASE_URI']='sqlite://'+os.path.join(os.getcwd(),'data.sqlite')
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///'+os.path.join(os.getcwd(),'data.sqlite')
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN']=True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
           
db=SQLAlchemy(app)
migrate=Migrate(app,db)

manager=Manager(app) 
manager.add_command('db',MigrateCommand)
                    
members=db.Table('members',db.Column('user_id',db.Integer,db.ForeignKey('users.id')),\
                           db.Column('group_id',db.Integer,db.ForeignKey('groups.id')))
                           #db.UniqueConstraint('user_id', 'group_id', name='UC_user_id_group_id'))
class Group(db.Model):
    __tablename__='groups'
    fields="""city,contacts,country,description"""

    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(100))
    screen_name=db.Column(db.String(100))
    is_closed=db.Column(db.Integer) #является ли сообщество закрытым. Возможные значения: 
                                    # 0 — открытое;
                                    # 1 — закрытое;
                                    # 2 — частное.
    deactivated=db.Column(db.String(50)) #сообщество удалено или заблокировано. Возможные значения:
                                         # deleted — сообщество удалено;
                                         # banned — сообщество заблокировано;

    is_admin=db.Column(db.Integer)  #информация о том, является ли текущий пользователь руководителем. Возможные значения:
                                    # 1 — является;
                                    # 0 — не является.

    type_gr=db.Column(db.String(50)) # тип сообщества:
                                     # group — группа;
                                     # page — публичная страница;
                                     # event — мероприятие.                 
                                                   
    photo_50=db.Column(db.String(255)) #URL главное фото 50x50                                 
    photo_100=db.Column(db.String(255)) #URL главное фото 100x100
    photo_200=db.Column(db.String(255)) #URL главное фото 200x200

    city_id=db.Column(db.Integer,db.ForeignKey('citys.id'))
    country_id=db.Column(db.Integer,db.ForeignKey('countrys.id'))
    contacts=db.Column(db.PickleType) # информация из блока контактов публичной страницы. Массив объектов, каждый из которых может содержать поля:
                                      # user_id (integer) — идентификатор пользователя;
                                      # desc (string) — должность;
                                      # phone (string) — номер телефона;
                                      # email (string) — адрес e-mail.

    description=db.Column(db.Text)
    gr_users=db.relationship('User',secondary=members,backref=db.backref('groups',lazy='dynamic'),lazy='dynamic')
    users_add=db.relationship('MemberAdd',backref='group_add',lazy = 'dynamic')
    users_del=db.relationship('MemberDel',backref='group_del',lazy = 'dynamic')
    on_scan=db.Column(db.Integer)  #1-сканировать, 0-нет скана
    last_scan=db.Column(db.DateTime)  #время последнего сканирования
    period_scan=db.Column(db.Integer) #Период сканирования в минутах 1440 сутки
    start_scan_time=db.Column(db.DateTime) #Время начала сканирования
 
    def toJSON(self):
        # print(self.last_scan)
        # print(datetime.timestamp(self.last_scan))
        json_group={
            'id':self.id,
            'name':self.name,
            'screen_name':self.screen_name,
            'is_closed':self.is_closed,
            'deactivated':self.deactivated,
            'is_admin':self.is_admin,
            'type_gr':self.type_gr,
            'photo_50':self.photo_50,
            'photo_100':self.photo_100,
            'photo_200':self.photo_200,
            'city':City.query.get(self.city_id).title,
            'counrty':Country.query.get(self.country_id).title,
            'contacts':self.contacts,
            'description':self.description,
            'on_scan':self.on_scan,
            'last_scan':round(datetime.timestamp(self.last_scan)),
            'period_scan':self.period_scan,
            'start_scan_time':round(datetime.timestamp(self.start_scan_time))
        }
        return json_group

    def __repr__(self):
        return '<Id группы %r, название: %r>' %(self.id,self.name)

class University(db.Model):
    __tablename__='universitys'
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(255))
    stud=db.relationship('User',backref='students_university',lazy = 'dynamic')

    def toJSON():
        json_university={
            'id':self.id,
            'title':self.name
        }
        return json_university

class Faculty(db.Model):
    __tablename__='facultys'
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(255))
    university_id=db.Column(db.Integer,db.ForeignKey('universitys.id'))
    stud=db.relationship('User',backref='students_faculty',lazy = 'dynamic')

    def toJSON():
        json_faculty={
            'id':self.id,
            'title':self.name,
            'university':University.query.get(university_id).name
        }
        return json_faculty

class User(db.Model):
    __tablename__='users'
    fields="""activities,bdate,city,connections,contacts,country,domain,education,
              followers_count,home_town,last_seen,maiden_name,nickname,occupation,photo_50,photo_100,photo_200,relation,
              screen_name,sex,site,verified"""

    id=db.Column(db.Integer,primary_key=True)
    first_name=db.Column(db.String(255))   #имя
    last_name=db.Column(db.String(255))    #фамилия
    deactivated=db.Column(db.String(50))      #string поле возвращается, если страница пользователя удалена или заблокирована,
                                           #содержит значение deleted или banned. В этом случае опциональные поля не возвращаются.

    #about=db.Column(db.String(255))        #содержимое поля «О себе» из профиля
    activities=db.Column(db.String(1024))   #содержимое поля «Деятельность» из профиля
    bdate=db.Column(db.String(100))        #дата рождения. Возвращается в формате D.M.YYYY или D.M (если год рождения скрыт). 
                                           #Если дата рождения скрыта целиком, поле отсутствует в ответе
    #books=db.Column(db.String(255))        #содержимое поля «Любимые книги» из профиля пользователя.

    #career нужно сделать таблицу с карьерой
      
    city_id=db.Column(db.Integer,db.ForeignKey('citys.id'))
    country_id=db.Column(db.Integer,db.ForeignKey('countrys.id'))
    #connections добавить поле в запрос
    skype=db.Column(db.String(100))        #skype
    facebook=db.Column(db.String(100))     #facebook
    twitter=db.Column(db.String(100))      #twitter
    livejournal=db.Column(db.String(100))  #livejournal
    instagram=db.Column(db.String(100))    #instagram

    followers_count=db.Column(db.Integer)  #количество подписчиков пользователя.

    #common_count=db.Column(db.Integer)     #количество общих друзей с текущим пользователем

    #счетчики


    #contacts
    mobile_phone=db.Column(db.String(50))  #номер мобильного телефона пользователя 
    home_phone=db.Column(db.String(50))    #дополнительный номер телефона пользователя 

    #education
    university_id=db.Column(db.Integer,db.ForeignKey('universitys.id'))
    faculty_id=db.Column(db.Integer,db.ForeignKey('facultys.id'))
    graduation=db.Column(db.Integer)      #год окончания уч заведения

    domain=db.Column(db.String(100))      #короткий адрес страницы
    home_town=db.Column(db.String(100))   #родной город

    last_seen_time=db.Column(db.Integer) #время последнего посещения
    last_seen_platform=db.Column(db.Integer) #тип платформы   1 — мобильная версия;
                                                              #2 — приложение для iPhone;
                                                              #3 — приложение для iPad;
                                                              #4 — приложение для Android;
                                                              #5 — приложение для Windows Phone;
                                                              #6 — приложение для Windows 10;
                                                              #7 — полная версия сайта;
                                                              #8 — VK Mobile.

    #lists=db.Column(db.String(100))      #
    sex=db.Column(db.Integer)             #пол 1-женский, 2-Мужсой, 0-не указан
    relation=db.Column(db.Integer)        #статус 0-не указано, 1-нет, 2-есть друг, 3-помолвлена, 4-женат
                                          #5-все сложно, 6-в поиске, 7 влюблен, 8 граджд брак
    relation_partner=db.Column(db.Integer)#партнер если указан

    maiden_name=db.Column(db.String(100)) #девичья фамилия
    nickname=db.Column(db.String(100)) #никнейм (отчество) пользователя

    #occupation информация о текущем роде занятия пользователя. Объект, содержащий следующие поля:
    occupation_type=db.Column(db.String(20)) #work — работа;
                                             #school — среднее образование;
                                             #university — высшее образование.
    occupation_id=db.Column(db.Integer) #идентификатор школы, вуза, сообщества компании (в которой пользователь работает);
    occupation_name=db.Column(db.String(255)) #название школы, вуза или места работы

    verified=db.Column(db.Integer)        #возвращается 1, если страница пользователя верифицирована, 0 — если нет

    site=db.Column(db.String(200)) #адрес сайта, указанный в профиле
    photo_50=db.Column(db.String(100))
    photo_100=db.Column(db.String(100))
    photo_200=db.Column(db.String(100))

    groups_add=db.relationship('MemberAdd',backref='user_add',lazy = 'dynamic')
    groups_del=db.relationship('MemberDel',backref='user_del',lazy = 'dynamic')

    def toJSON(self):
        #print(self.id)
        #print(self.city_id)
        if self.deactivated!='OK':
            json_user={'deactivated':True}
        else:
            univ=None
            facult=None
            city=None
            if self.city_id==None:
                city=City.query.get(self.city_id).title
            if self.university_id==None:
                univ=University.query.get(self.university_id).name
            if self.faculty_id==None:
                facult=Faculty.query.get(self.faculty_id).name
            json_user={
                'id':self.id,
                'first_name':self.first_name,
                'last_name':self.last_name,
                'deactivated':False,
                'activities':self.activities,
                'bdate':self.bdate,
                'city':city,
                'skype':self.skype,
                'facebook':self.facebook,
                'twitter':self.twitter,
                'livejournal':self.livejournal,
                'instagram':self.instagram,
                'followers_count':self.followers_count,
                'mobile_phone':self.mobile_phone,
                'home_phone':self.home_phone,
                'university':univ,
                'faculty':facult,
                'graduation':self.graduation,
                'domain':self.domain,
                'home_town':self.home_town,
                'last_seen_time':self.last_seen_time,
                'last_seen_platform':self.last_seen_platform,
                'sex':self.sex,
                'relation':self.relation,
                'relation_partner':self.relation_partner,
                'maiden_name':self.maiden_name,
                'nickname':self.nickname,
                'occupation_type':self.occupation_type,
                'occupation_id':self.occupation_id,
                'occupation_name':self.occupation_name,
                'verified':self.verified,
                'site':self.site,
                'photo_50':self.photo_50,
                'photo_100':self.photo_100,
                'photo_200':self.photo_200
            }
        return json_user

class City(db.Model):
    __tablename__='citys'
    id=db.Column(db.Integer,primary_key=True)
    title=db.Column(db.String(100))

    groups=db.relationship('Group',backref='city_group',lazy = 'dynamic')
    users=db.relationship('User',backref='city_user',lazy = 'dynamic')

    def toJSON(self):
        json_city={
            'id':self.id,
            'title':self.title
        }
        return json_city

class Country(db.Model):
    __tablename__='countrys'
    id=db.Column(db.Integer,primary_key=True)
    title=db.Column(db.String(100))
    groups=db.relationship('Group',backref='counrty_group',lazy = 'dynamic')
    users=db.relationship('User',backref='counrty_user',lazy = 'dynamic')

    def toJSON(self):
        json_counrty={
            'id':self.id,
            'title':self.title
        }
        return json_counrty

class MemberAdd(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    group_id=db.Column(db.Integer,db.ForeignKey('groups.id'))
    user_id=db.Column(db.Integer,db.ForeignKey('users.id'))
    date=db.Column(db.DateTime)

    def toJSON(self):
        curUser=User.query.get(self.user_id).toJSON()
        curUser['action']={
            'type':'add',
            'date':round(datetime.timestamp(self.date))
        }
        return curUser

class MemberDel(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    group_id=db.Column(db.Integer,db.ForeignKey('groups.id'))
    user_id=db.Column(db.Integer,db.ForeignKey('users.id'))
    date=db.Column(db.DateTime)

    def toJSON(self):
        curUser=User.query.get(self.user_id).toJSON()
        curUser['action']={
            'type':'del',
            'date':round(datetime.timestamp(self.date))
        }

        return curUser

if __name__=='__main__':
    manager.run()



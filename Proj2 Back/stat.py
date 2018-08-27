from vkDB import *
from datetime import datetime
from vkfun import *
from flask import Flask



class statistic():
    def __init__(self,id_Group):
        self.idGroup=id_Group
        self.added={}
        self.deleted={}
        self.added_users={}
        self.deleted_users={}
       
        self.qwst={
            'day':{'year':0,'month':0,'day':1,'hour':0,'minute':0,'second':0},
            'week':{'year':0,'month':0,'day':7,'hour':0,'minute':0,'second':0},
            'month':{'year':0,'month':1,'day':0,'hour':0,'minute':0,'second':0},
            'year':{'year':1,'month':0,'day':0,'hour':0,'minute':0,'second':0}
        }

        #dict.keys()
    def refresh(self):
        for key in self.qwst.keys():
            dt=datetime.now()
            year=self.qwst[key].get('year',0)
            month=self.qwst[key].get('month',0)
            day=self.qwst[key].get('day',0)
            hour=self.qwst[key].get('hour',0)
            minute=self.qwst[key].get('minute',0)
            second=self.qwst[key].get('second',0)
            dt=subtractDateTime(dt,year=year,month=month,day=day,hour=hour,minute=minute,second=second)
            cnt=User.query.join(MemberDel,MemberDel.user_id==User.user_id).filter(MemberDel.group_id==self.idGroup).filter(MemberDel.date>dt).count()
            self.deleted[key]=cnt
            cnt=User.query.join(MemberAdd,MemberAdd.user_id==User.user_id).filter(MemberAdd.group_id==self.idGroup).filter(MemberAdd.date>dt).count()
            self.added[key]=cnt

            print('Количество удаланных:%s'%self.deleted[key])
            print('Количество добавденных:%s'%self.added[key])
    
   # def getUsers(self,period):
        

            
  #     dtn=datetime.now()
  #     dtn.replace(hour=0, minute=0, second=0, microsecond=0)
  #     dateRequest=subtractDateTime(dtn,day=1)
  #     self.added_day=MemberAdd.query.filter_by(group_id=self.idGroup).select(date>dateRequest).count()
    
if __name__=='__main__':
    app=Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///'+os.path.join(os.getcwd(),'data.sqlite')
    app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN']=True
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
    #db=SQLAlchemy(app)
    #dt=datetime.now()
    #dt=subtractDateTime(dt,day=40)
    #a=User.query.join(MemberDel,MemberDel.user_id==User.user_id).filter(MemberDel.group_id==142798443).filter(MemberDel.date>dt).all()
    #b=MemberDel.query.filter_by(user_id=a[0].user_id).filter_by(group_id=142798443).first()
    #print(b.date)
    #a=statistic(142798443)
    #a.refresh()
    a=MemberAdd.query.filter_by(group_id=142798443).order_by(MemberAdd.date.desc()).join(User,(User.user_id==MemberAdd.user_id)).all()
    #a=User.query.join(MemberAdd,(User.user_id==MemberAdd.user_id)).filter_by(group_id=142798443).order_by(MemberAdd.date.desc()).all()
    for user in a:
        print('Id пользователя: %s, дата обнаружения: %s' %(user.user_add.first_name,user.date))

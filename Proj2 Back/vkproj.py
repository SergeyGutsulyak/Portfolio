from flask import Flask, render_template
from flask import request
from flask_wtf import Form
from wtforms import StringField, SubmitField, PasswordField
from wtforms.validators import Required

class LoginForm(Form):
    user=StringField('Имя пользователя',validators=[Required()])
    password=PasswordField('Пароль')
    submit=SubmitField('Войти')
    #validators=[Required()]

app=Flask(__name__)

menu=[]
menu.append(['/','Главная'])
menu.append(['/auth','АвторизацияVk'])
menu.append(['/users','Пользоатели'])
menu.append(['/groups','Группы'])
menu.append(['/posts','Посты'])
menu.append(['/settings','Настройки'])

@app.route('/',methods=['GET','POST'])
def index():
    return render_template('base2.html',menu=menu)

@app.route('/posts')
def posts():
    return render_template('base2.html',menu=menu)

@app.route('/auth',methods=['GET','POST'])
def auth():
    user=None
    password=None
    form=LoginForm()
    if form.validate_on_submit():
        user=form.user.data
        password=form.password.data
        form.user.data=''
        form.password.data=''
    return render_template('base.html',menu=menu,form=form,user=user,password=password)
    

@app.route('/users')
def users():
    return render_template('base2.html',menu=menu)

@app.route('/groups')
def groups():
    return render_template('base2.html',menu=menu)


@app.route('/settings')
def settings():
    return render_template('base2.html',menu=menu)


if __name__=='__main__':
    app.config['SECRET_KEY']='bfjlkjsdfgcdfgsdh'
    app.run(debug=True)
    

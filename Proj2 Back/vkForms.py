from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField
from wtforms.validators import Required

class CityForm(FlaskForm):
	city_id=IntegerField('ID города',validators=[Required()])
	city_title=StringField('Название города',validators=[Required()])
	submit=SubmitField('Добавить')

class GroupForm(FlaskForm):
	group_id=StringField('ID Группы или короткое имя',validators=[Required()])
	submit=SubmitField('Добавить')
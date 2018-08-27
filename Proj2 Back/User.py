class User:
    def __init__(self, id_user, first_name, last_name, photo_id, sex, bdate):
        self.id_user=id_user
        self.first_name=first_name
        self.last_name=last_name
        self.photo_id=photo_id
        self.sex=sex
        self.bdate=bdate
        self.groups=[]
    #добавляет пользователя в группу
    def addgroup(self,id_group):
        if not id_group in self.groups:
            self.groups.append(id_group)
        else:
            print('Пользователь уже состоит в этой группе')

    # удаляет у пользователя группу
    def delgroup(self,id_group):
        if id_group in self.groups:
            self.groups.remove(id_group)
        else:
            print('Пользователь не состоял в этой группе')

'use strict';
module.exports = function(sequelize, DataTypes) {
  var Students = sequelize.define('Students', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    gender: DataTypes.STRING,
    birthday: DataTypes.DATE,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        isUnique: function(value, next) {
          Students.find({
            where: {email: value},
            attributes: ['id']
          })
          .done(function(error, user) {
            if (error)
                // Some unexpected error occured with the find method.
                return next('Email address already in use!');
            if (user)
                // We found a user with this email address.
                // Pass the error to the next method.
                return next('Email address already in use!');
            // If we got this far, the email address hasn't been used yet.
            // Call next with no arguments when validation is successful.
            next();
          });
        }
      }
    },
    phone: {
      type: DataTypes.INTEGER,
      validate: {
        len: function(value) {
          if (value.length < 10 || value.length > 13) {
            throw new Error('Phone length must be 10 - 13');
          }
        },
        isNumeric: true,
        isAlphanumeric: {
          args: false,
          msg: "Phone not allowed letters\nPhone not allowed alphanumeric"
        }
      }
    },
    height : {
      type : DataTypes.INTEGER,
      validate : {
        min : {
          args: 150,
          msg : 'Height should be above 150'
        }
      }
    }
}, {
    classMethods: {
      associate: function(models) {
        Students.belongsToMany(models.Teachers, {through: 'Student_teachers', foreignKey: 'student_id'});
      },
      getAllData(callback) {
        Students.findAll()
        .then((data) => {
          data.forEach((element) => element.full_name = `${element.first_name} ${element.last_name}`);
          return callback(data);
        });
      }
    },

    instanceMethods: {
      getFullName : function() {
        return `${this.first_name} ${this.last_name}`;
      },
      getAge: function() {
        let result =  new Date().getFullYear() - this.birthday.getFullYear();
        return `Age: ${result}`;
      }
    }
  });
  return Students;
};

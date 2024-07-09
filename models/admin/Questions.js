const {Sequelize,DataTypes} = require('sequelize')

const sequelize = require('../../app/config/sequelize')

const Questions = sequelize.define("Questions",{
            id:{
                type:DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4, 
                primaryKey: true
            },
            Questions:{type:DataTypes.TEXT},
            DefaultAnswer:{type:DataTypes.STRING},
            status:{type:DataTypes.BOOLEAN,defaultValue:true},
            serialNo:{type:DataTypes.INTEGER},
            ParentQuestionID:{type:DataTypes.INTEGER},
            childQuestionID:{type:DataTypes.INTEGER},
           // ParentQuestionID:{type:DataTypes.INTEGER},

            // ParentQuestionID: {
            //     type: DataTypes.UUID, // Assuming it's a UUID like the primary key
            //     references: {
            //         model: "Questions", // Name of the target table (same table in this case)
            //         key: "id" // Name of the target column
            //     }
            // }
})

module.exports  = Questions
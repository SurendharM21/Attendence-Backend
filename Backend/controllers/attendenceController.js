const attendence = require("../models/attendenceModel")
const userModel = require("../models/userModel")
const errorhandler =require("../utils/errorhandler")
const moment = require("moment")
const excelJs=require("exceljs")
const fs = require("fs")


exports.giveAttendence = async(req,res,next)=>{
const {email} = req.params

    const {status,date,wfh,time,reason} = req.body

    const user = await userModel.findOne({email})

    if(!user)
        {
            return next(new errorhandler("Not an User",401))
        }

    if(status === 'paidLeave')
        {
            let remPaidLeave = user.paidLeave
            if(remPaidLeave <= 0)
                {
                    return next(new errorhandler("You cannot avail paid Leave",402))
                }
            remPaidLeave--;
            user.paidLeave = remPaidLeave;
           
        }
        
    if(status === 'sickLeave')
        {
            let remSickLeave = user.sickLeave
            if(remSickLeave <= 0)
                {
                    return next(new errorhandler("You cannot avail paid Leave",402))
                }
                remSickLeave--;
            user.sickLeave = remSickLeave
            
        }
        user.save()

    const report =await attendence.create({
        user: user.name,
        email: user.email,
        status: status,
        date: date,
        wfh: wfh,
        time:time,
        reason:reason
    })
    if(!report)
        {
            return next(new errorhandler("not generate any report",400))
        }
        res.json({
            success:true,
            message:"Report Generated",
            report,
          
        })
 }

 exports.displayAttendence = async(req,res,next)=>{

    const {email} = req.params
    
    const user = await userModel.findOne({email})
    if(!user)
        {
            return next(new errorhandler("Not an User",401))
        }
        const today = new Date()
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        console.log(nextMonth)
const newDate = new Date(today.getFullYear(),today.getMonth(),1)
console.log(newDate)
const report = await attendence.find({ email, 'date': { '$gte': newDate,'$lte': nextMonth}});


  
    console.log(today)
    const d = new Date(today.getFullYear(),today.getMonth(),1);
    console.log(d)
    if (today.getFullYear() === d.getFullYear() &&
        today.getMonth() === d.getMonth() &&
        today.getDate() === d.getDate()) {
            console.log("Hello inner")
            user.sickLeave = user.sickLeave +1;
            user.paidLeave = user.paidLeave +1;           
    }
    user.save()
    if(!report)
        {
            return next(new errorhandler("No logs are Present",401))
        }
        res.json({
            success:true,
            message:"Report Generated",
            report,
            user
        })
 }

 exports.displayAllAttendence = async(req,res,next)=>{

    const {date} = req.body
    console.log(req.body)
    const allAttendence = await attendence.find({date})

    if(!allAttendence)
        {
            return next(new errorhandler("Please enter Correct Date",400))
        }
    res.json({
        success:true,
        allAttendence
    })
 }

 exports.displayLogs = async(req,res,next)=>{

    const {date,status} = req.body


    const logs = await attendence.find({$and:[{date},{status}]})

    res.json({
        success:true,
        logs
    })
 }
 
 exports.exportReport = async (req, res, next) => {
    try {
        const { email } = req.params;

        const user = await userModel.findOne({ email });
        if (!user) {
            return next(new errorhandler("Not an User", 401));
        }

        const report = await attendence.find({ email });

        const workbook = new excelJs.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        worksheet.columns = [
            { header: 'Date', key: 'date', width: 20 },
            { header: 'Status', key: 'status', width: 10 },
            { header: 'Login-Time', key: 'time', width: 20 },
            {header: 'Logout-Time', key: 'logoutTime', width: 20}
        ];

        report.forEach(row => {
            worksheet.addRow([row.date, row.status, moment(row.time).format("hh:mm:ss a"), moment(row.logoutTime).format("hh:mm:ss a")]);
        });

        const filePath = 'data.xlsx';
        await workbook.xlsx.writeFile(filePath);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filePath}"`);

      
        const fileStream = fs.createReadStream(filePath);
        
       fileStream.pipe(res);

        fileStream.on('close', () => {
            fs.unlinkSync(filePath);
        });
    } catch (error) {
        console.error('Error occurred while exporting report:', error);
        next(error); 
    }
};


 

 




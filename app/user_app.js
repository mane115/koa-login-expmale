var dao = require('../dao/user_dao.js');
var apply = function*() {
    console.log('user apply')
    var client = tool.resClient(this)
    try {
        var applyInfo = this.request.body.user;
        console.log(applyInfo)
        var accountData = yield dao.findAccount(applyInfo)
        yield checkAccountExist(accountData, 'apply')
        yield dao.createAccount(applyInfo);
        yield client.success('apply success')
    } catch (err) {
        console.log(err);
        client.fail(err)
    }
}
var login = function*() {
    console.log('user login');
    var client = tool.resClient(this)
    try {
        var loginInfo = this.request.body.user;
        var data = yield dao.findAccount(loginInfo);
        yield checkAccountExist(data, 'login');
        yield compairPassword(data[0].password, loginInfo.password);
        this.session.accountName = loginInfo.accountName
        yield client.success('login success')
    } catch (err) {
        console.log(err)
        client.fail(err)
    }
}
var changePassword = function*() {
    console.log('user change password');
    var client = tool.resClient(this)
    try {
        var userInfo = this.request.body.user;
        userInfo.accountName = this.session.accountName;
        var data = yield dao.findAccount(userInfo);
        yield checkAccountExist(data, 'login');
        yield compairPassword(data[0].password, userInfo.password);
        yield dao.changePassword(userInfo);
        //distory session if needed
        yield client.success('update success')
    } catch (err) {
        console.log(err)
        client.fail(err)
    }
}
var unLogin = function*() {
    var client = tool.resClient(this)
    console.log('this.session remove:', this.session)
    this.session = null
    yield client.success('unLogin success')
}
var upload = function*() {
    var client = tool.resClient(this);
    //尝试在app中操作generalMethod
    try {
        console.log('user upload')
        var update = {
                avatar: null
            },
            condition = {
                accountName: this.session.accountName
            },
            option = {
                new: true
            };
        update.avatar = yield tool.uploadImg(this);
        var cbData = yield dao.generalUpdate(condition, update, option);
        yield client.success(cbData)
    } catch (err) {
        client.fail(err)
    }
};
var localTest = function*() {
    var client = tool.resClient(this);
    try {
        console.log(`location test`)
        var local = this.request.body.local;
        /*local = {
            x:192,
            y:168
        }*/
        var msg = yield dao.queryLocation(local);
        yield client.success(msg)
    } catch (err) {
        client.fail(err)
    }
};
///////////////////////////////////////////////////
module.exports = {
    apply,
    login,
    changePassword,
    unLogin,
    upload,
    localTest
};
///////////////////////////////////////////////////
function* checkAccountExist(data, usage) {
    console.log('find success,checkData:', data)
    if (data.length !== 0 && usage === 'apply') {
        throw 'account exist'
    } else if (data.length === 0 && usage === 'apply') {
        return
    } else if (data.length === 1 && usage === 'login') {
        return
    } else {
        throw 'account not exist'
    }
}

function* compairPassword(pd1, pd2) {
    console.log(`compairing,${pd1} & ${pd2}`)
    if (pd1 === pd2) {
        return
    } else {
        throw 'password error'
    }
}
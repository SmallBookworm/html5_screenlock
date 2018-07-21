/**
 *数据
 */
var r = 2;
var centre = [];
var sure = false;
//暂时记录输入密码
var password = [];
Object.defineProperty(password, 'push', {
    enumerable: false,
    value: function (value) {
        for (var i in password) {
            if (password[i] == value)
                return false;
        }
        return this.__proto__.push.call(this, value);
    }
});

/**
 *视图
 */
function initCanvas(canvas) {
    r = canvas.width / 10;
    centre.length=[];
    for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
            centre.push([(1 + x * 4) * r, (1 + y * 4) * r]);
        }
    }
    flash(canvas);
    if (sure)
        test(canvas, "请再次输入手势密码");
    else
        test(canvas, "请输入手势密码");
}
//线路径
function e_line(context, x1, y1, x2, y2) {
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
}
//圆路径
function e_arc(context, x, y, r) {
    context.arc(x, y, r, 0, 2 * Math.PI);
}
//重制手势输入区域
function flash(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.width);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(192,192,192)';
    for (var x = 0; x < 9; x++) {
        ctx.beginPath();
        e_arc(ctx, centre[x][0], centre[x][1], r - 2);
        ctx.stroke();
    }
}
//密码输入动画
function move(canvas, x, y) {
    var ctx = canvas.getContext("2d");
    flash(canvas);
    ctx.fillStyle = 'rgb(255,166,55)';
    for (var i in password) {
        ctx.strokeStyle = 'rgb(250,149,39)';
        ctx.beginPath();
        e_arc(ctx, centre[password[i]][0], centre[password[i]][1], r - 2);
        ctx.fill();
        ctx.stroke();
        if (i != 0) {
            ctx.strokeStyle = 'rgb(221,45,38)';
            ctx.beginPath();
            e_line(ctx, centre[password[i - 1]][0], centre[password[i - 1]][1], centre[password[i]][0], centre[password[i]][1]);
            ctx.stroke();
        }
    }
    if (x && password.length != 0) {
        ctx.strokeStyle = 'rgb(221,45,38)';
        ctx.beginPath();
        e_line(ctx, centre[password[i]][0], centre[password[i]][1], x, y);
        ctx.stroke();
    }

}
//更新提示文字
function test(canvas, str) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = 'white';
    ctx.fillRect(0, canvas.width + 2, canvas.width, canvas.width);
    ctx.font = canvas.height * 0.5 / 6.8 + 'px Helvetica Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(str, canvas.width / 2, canvas.height * 6.5 / 6.8, canvas.width);
}
/**
 *控制
 */
//处理输入事件
function control(canvas, radios) {
    var fpassword = '';
    canvas.addEventListener('touchstart', function (event) {
        event.preventDefault();
        if (!sure)
            test(canvas, "请输入手势密码");
    });
    canvas.addEventListener('touchmove', function (event) {

        if (event.targetTouches.length == 1) {
            event.preventDefault();
            var touch = event.targetTouches[0];
            var x = touch.clientX - canvas.offsetLeft;
            var y = touch.clientY - canvas.offsetTop;
            if (y > canvas.width)
                return 0;
            var posY = parseInt(y / (2 * r));
            var posX = parseInt(x / (2 * r));
            if (posY % 2 == 0 && posX % 2 == 0) {
                password.push((posY / 2) * 3 + posX / 2);
            }
            move(canvas, x, y);

        }
    });
    canvas.addEventListener('touchend', function (event) {
        event.preventDefault();
        if (password.length == 0)
            return 0;
        move(canvas);
        if (radios.password[0].checked) {
            if (sure) {
                if (password.toString() == fpassword) {
                    localStorage.password = password.toString();
                    test(canvas, '密码设置成功');
                } else {
                    test(canvas, '两次输入的不一致');
                }
                sure = false;
            } else {
                if (password.length < 5) {
                    test(canvas, '密码太短，至少需要5个点');
                } else {
                    fpassword = password.toString();
                    sure = true;
                    test(canvas, '请再次输入手势密码');
                }
            }
        } else {
            if (password.toString() == localStorage.password) {
                test(canvas, '密码正确！');
            } else {
                test(canvas, '输入的密码不正确');
            }
        }
        password.length = 0;
        move(canvas);
    })
}
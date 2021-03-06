import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpService } from '../http.service';
import { SettingService } from '../setting.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

    // 存储的KEY
    key = 'Auth';

    // 是否登录
    isLoggedIn = false;

    // 重定向的页面
    redirectUrl: string;

    // 控制器的名称
    controllerName = 'auth';

    private _user = null;

    get user(): User {
        if (!this._user) {
            let session = this.settingService.getSession(this.key);
            let local = this.settingService.getLocal(this.key)
            this._user = Object.assign(new User(), session ? session : local);
            this.settingService.setSession(this.key, this._user);
        }
        return this._user;
    }

    set user(value: User) {
        this._user = Object.assign(this._user ? this._user : new User(), value);
        this.settingService.setSession(this.key, this._user);
        if (this._user.rememberClient) this.settingService.setLocal(this.key, this._user);
    }

    removeLocal() {
        this.settingService.removeLocal(this.key);
    }

    removeSession() {
        this.settingService.removeSession(this.key);
    }

    constructor(
        public httpService: HttpService,
        public settingService: SettingService
    ) {
        if (this.user.account && this.user.token) {
            this.isLoggedIn = true;
        }
    }

    /**
     * 登录
     * 
     * @param {User} user 
     * @returns {Observable<result<string>>} 
     * @memberof AuthService
     */
    login(user: User): Observable<any> {
        return Observable.create((x) => {
            this.httpService
                .post(`${this.controllerName}/login`, user)
                .subscribe((z) => {
                    this.user = Object.assign(user, z);
                    this.isLoggedIn = true;
                    x.next(z)
                    x.complete();
                }, k => {
                    x.error(k)
                })
        })

    }

    /**
     * 登出
     * 
     * @returns {Observable<boolean>} 
     * @memberof AuthService
     */
    logout(): Observable<boolean> {
        return of(true).pipe(
            tap(() => {
                this.removeLocal();
                this.removeSession();
                this.isLoggedIn = false;
            })
        )
    }
}

/**
 * 用户对象
 * 
 * @export
 * @class User
 */
export class User {
    // 用户名
    account?: string = '';
    // 密码
    password?: string = '';
    // token
    token?: string = '';
    // 姓名
    name?: string = '';
    // 权限
    permissions?: {
        actions?: Action[],
        menus?: Menu[]
    } = { actions: [], menus: [] }
}

export class Action {
    code: string;
    icon: string;
    id: string;
    menuId: string;
    name: string;
}

export class Menu {
    icon: string;
    id: string;
    label: string;
    parentId: string;
    path: string;
    router: string;
}




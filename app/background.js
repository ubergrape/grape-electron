// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, BrowserWindow, ipcMain } from 'electron';
import devHelper from './vendor/electron_boilerplate/dev_helper';
import windowStateKeeper from './vendor/electron_boilerplate/window_state';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

var Menu = require("menu");

var mainWindow;

// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
    width: 900,
    height: 1000
});

app.on('ready', function () {

    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
    });

    if (mainWindowState.isMaximized) {
        mainWindow.maximize();
    }

    if (env.name === 'test') {
        mainWindow.loadURL('file://' + __dirname + '/spec.html');
    } else {
        mainWindow.loadURL('file://' + __dirname + '/app.html');
    }

    if (env.name !== 'production') {
        devHelper.setDevMenu();
        mainWindow.openDevTools();
    }

    mainWindow.on('close', function () {
        mainWindowState.saveState(mainWindow);
    });

    // Create the Application's main menu and enable the most important shortcuts.
    var template = [{
        label: "Application",
        submenu: [
            { label: "About Grape", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

});

app.on('window-all-closed', function () {
    app.quit();
});

ipcMain.on('addBadge', function(e, badge) {
  app.dock.setBadge(String(badge))
});

ipcMain.on('removeBadge', function() {
  app.dock.setBadge('')
});

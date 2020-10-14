import ShouldAuth from 'middleware/router/auth.middleware';
import response from 'response/DefaultResponse';
import Mapper from 'service/setting/mapper';
import ChangePasswordSetting from 'service/setting/account/change-password.setting';
import SettingService from 'service/setting/setting.service';
import PasswordChangeValidation from 'middleware/validation/passwordChange.validation';

export default (router) => {
  router
    .use(['/setting'], ShouldAuth())
    .use(['/setting/password'], PasswordChangeValidation());

  router.put('set_setting', '/setting/:name/set', async (ctx: any) => {
    const settingArray = ctx.request.body;
    const { name } = ctx.params;

    if (Mapper[ctx.params.name]) {
      const setting = new Mapper[name]();
      setting.setName(name);
      setting.setSetting(settingArray);
      setting.setUser(ctx.state.user);

      const settingService = new SettingService();
      settingService.addSetting(setting);
      await settingService.process();
    }

    ctx.body = response.response(ctx.request.body, 'Setting has been saved!');
  });
  router.get('get_setting', '/setting/:name/get', async (ctx: any) => {
    const { name } = ctx.params;

    if (Mapper[ctx.params.name]) {
      const setting = new Mapper[name]();
      setting.setName(name);
      setting.setUser(ctx.state.user);

      const settingService = new SettingService();
      settingService.addSetting(setting);
      const settingData = await settingService.get();
      ctx.body = response.response(settingData[name], '');
    } else {
      ctx.body = response.response({}, 'Invalid setting!');
    }
  });

  router.put('change-password', '/setting/password', async (ctx: any) => {
    const settingArray = ctx.request.body;
    const changePasswordSetting = new ChangePasswordSetting();
    changePasswordSetting.setSetting(settingArray);
    changePasswordSetting.setUser(ctx.state.user);

    const settingService = new SettingService();
    settingService.addSetting(changePasswordSetting);
    await settingService.process();

    ctx.body = response.response({}, 'Successfully changed!');
  });

  return router;
};

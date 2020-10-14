import shouldAuth from 'middleware/router/auth.middleware';
import response from 'response/default.response';
import MetaService from 'service/meta.service';
import Department from '../../service/item/department';

export default (router: any) => {
  router.use(['/departments'], shouldAuth());

  router.get('get-departments', '/departments', async (ctx: any) => {
    const metaService = new MetaService();
    const departmentList = await metaService.getDepartments();

    ctx.body = response.response(departmentList);
    ctx.status = 200;
  });

  router.post('add-departments', '/departments', async (ctx: any) => {
    const metaService = new MetaService();
    const { name, description } = ctx.request.body;

    const department = new Department();
    department.name = name;
    department.description = description;

    const departmentItem = await metaService.addDepartment(department);

    ctx.body = response.response(departmentItem);
    ctx.status = 200;
  });

  router.get('status', '/status/:userId', async (ctx: any) => {
    const { userId } = ctx.params;

    const metaService = new MetaService();
    const content = await metaService.getStatus(userId);
    console.log(content);

    ctx.body = response.response(content);
    ctx.status = 200;
  });

  return router;
};

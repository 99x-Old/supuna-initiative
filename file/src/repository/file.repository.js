import File from '../model/file';

export default class FileRepository {
  async addFile(data: any) {
    const fileData = {
      reference: data.reference,
      url: data.url,
      data: data.data,
    };
    const file = new File(fileData);
    await file.save();
  }

  async getFile(reference: string): Promise<any> {
    return File.findOne({ reference });
  }
}

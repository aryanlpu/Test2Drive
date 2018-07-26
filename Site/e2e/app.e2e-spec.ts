import { SitePage } from './app.po';

describe('site App', () => {
  let page: SitePage;

  beforeEach(() => {
    page = new SitePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});

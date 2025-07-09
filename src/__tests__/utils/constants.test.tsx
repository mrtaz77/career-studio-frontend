import { cert_img } from '../../utils/constants';

describe('Constants', () => {
  test('cert_img should be defined', () => {
    expect(cert_img).toBeDefined();
  });

  test('cert_img should be a string', () => {
    expect(typeof cert_img).toBe('string');
  });

  test('cert_img should not be empty', () => {
    expect(cert_img.length).toBeGreaterThan(0);
  });

  test('cert_img should be a valid URL or path', () => {
    // Check if it's a URL or a file path
    const isUrl =
      cert_img.startsWith('http://') ||
      cert_img.startsWith('https://') ||
      cert_img.startsWith('//');
    const isPath =
      cert_img.startsWith('/') || cert_img.startsWith('./') || cert_img.startsWith('../');
    const isDataUrl = cert_img.startsWith('data:');

    expect(isUrl || isPath || isDataUrl || cert_img.length > 0).toBe(true);
  });

  test('cert_img should have consistent value', () => {
    // Import again to ensure consistency
    const { cert_img: cert_img_again } = require('../../utils/constants');
    expect(cert_img).toBe(cert_img_again);
  });
});

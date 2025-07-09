import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../../hooks/use-mobile';

// Mock window.matchMedia
const mockMatchMedia = jest.fn();

describe('useIsMobile Hook', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockMatchMedia.mockClear();

    // Mock the window.matchMedia function
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
  });

  test('should return false for desktop screen', () => {
    // Mock a desktop screen (width > 767px)
    mockMatchMedia.mockImplementation((query) => ({
      matches: false, // Desktop doesn't match mobile query
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Mock window.innerWidth for desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)');
  });

  test('should return true for mobile screen', () => {
    // Mock a mobile screen (width <= 767px)
    mockMatchMedia.mockImplementation((query) => ({
      matches: true, // Mobile matches the query
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Mock window.innerWidth for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 767,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)');
  });

  test('should update when screen size changes', () => {
    let mediaQueryList: MediaQueryList;

    // Mock matchMedia to capture the event listener
    mockMatchMedia.mockImplementation((query) => {
      mediaQueryList = {
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
      return mediaQueryList;
    });

    // Mock window.innerWidth for desktop initially
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());

    // Initially should be false (desktop)
    expect(result.current).toBe(false);

    // Simulate screen size change to mobile
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 767,
      });
      mediaQueryList.matches = true;
      // Trigger the change event
      if (mediaQueryList.addEventListener.mock.calls.length > 0) {
        const changeHandler = mediaQueryList.addEventListener.mock.calls[0][1];
        changeHandler({ matches: true });
      }
    });

    // Should now be true since we changed to mobile width and triggered the event
    expect(result.current).toBe(true);
  });

  test('should call matchMedia with correct query', () => {
    mockMatchMedia.mockImplementation(() => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    renderHook(() => useIsMobile());

    expect(mockMatchMedia).toHaveBeenCalledTimes(1);
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)');
  });

  test('should set up event listeners correctly', () => {
    const mockAddEventListener = jest.fn();
    const mockRemoveEventListener = jest.fn();

    mockMatchMedia.mockImplementation(() => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      dispatchEvent: jest.fn(),
    }));

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { unmount } = renderHook(() => useIsMobile());

    // Should set up event listener
    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));

    // Clean up
    unmount();

    // Should clean up event listener
    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  test('should handle matchMedia not being available', () => {
    // Remove matchMedia to simulate older browsers
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: undefined,
    });

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // Should not throw an error since the hook now handles missing matchMedia
    expect(() => {
      renderHook(() => useIsMobile());
    }).not.toThrow();
  });

  test('should be consistent across multiple calls', () => {
    mockMatchMedia.mockImplementation(() => ({
      matches: true,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 767,
    });

    const { result: result1 } = renderHook(() => useIsMobile());
    const { result: result2 } = renderHook(() => useIsMobile());

    expect(result1.current).toBe(result2.current);
  });
});

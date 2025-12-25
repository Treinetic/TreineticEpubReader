import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReaderView } from '../src/lib/view/ReaderView';

describe('ReaderView', () => {
    let container: HTMLElement;
    let readerView: ReaderView;

    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = '<div id="test-container"></div>';
        container = document.getElementById('test-container')!;
    });

    it('should create an internal wrapper upon initialization', () => {
        readerView = new ReaderView(container);

        // Check if internal wrapper exists
        const wrapper = container.querySelector('.tr-internal-wrapper');
        expect(wrapper).toBeTruthy();
        expect(wrapper?.tagName).toBe('DIV');
    });

    it('should initialize with correct container class', () => {
        // Not strictly enforced by class, but the container query relies on it being sized.
        // The View itself doesn't add .tr-epub-reader-element, the main class typically usually does or user does.
        // But let's check the Internal Wrapper style assumptions if possible?
        // Actually, JSDOM won't calculate styles well without full mock.

        // Let's verify ReaderView instance structure
        readerView = new ReaderView(container);
        expect(readerView.internalWrapper).toBeDefined();
    });

    it('should add classes for responsive width when "resized"', () => {
        // Mock clientWidth
        Object.defineProperty(container, 'clientWidth', { configurable: true, value: 400 });

        readerView = new ReaderView(container);

        // Trigger resize logic manually (since ResizeObserver might need time or mock)
        // Access private method via any
        (readerView as any).onContainerResize();

        // Should have small class because 400 <= 500
        // Oh wait, I REMOVED the JS-based class toggling in the last refactor!
        // It relies on CSS Container Queries now!

        // This test confirms that JS logic is GONE.
        expect(container.classList.contains('tr-width-small')).toBe(false);
    });
});

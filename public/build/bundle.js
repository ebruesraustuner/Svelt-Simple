
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_multiple_value(select) {
        return [].map.call(select.querySelectorAll(':checked'), option => option.__value);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\Nested.svelte generated by Svelte v3.46.4 */

    const file$1 = "src\\Nested.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let p;

    	const block = {
    		c: function create() {
    			main = element("main");
    			p = element("p");
    			p.textContent = "this is nested part";
    			add_location(p, file$1, 5, 2, 69);
    			add_location(main, file$1, 4, 0, 59);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nested', slots, []);
    	let { answer = "a mystery" } = $$props;
    	const writable_props = ['answer'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nested> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('answer' in $$props) $$invalidate(0, answer = $$props.answer);
    	};

    	$$self.$capture_state = () => ({ answer });

    	$$self.$inject_state = $$props => {
    		if ('answer' in $$props) $$invalidate(0, answer = $$props.answer);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [answer];
    }

    class Nested extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { answer: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nested",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get answer() {
    		throw new Error("<Nested>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set answer(value) {
    		throw new Error("<Nested>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (79:2) {:else}
    function create_else_block(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(/*count*/ ctx[0]);
    			t1 = text(" is between 5 and 10");
    			add_location(p, file, 79, 4, 2680);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*count*/ 1) set_data_dev(t0, /*count*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(79:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (77:22) 
    function create_if_block_1(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(/*count*/ ctx[0]);
    			t1 = text(" is less than 5");
    			add_location(p, file, 77, 4, 2636);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*count*/ 1) set_data_dev(t0, /*count*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(77:22) ",
    		ctx
    	});

    	return block;
    }

    // (75:2) {#if count > 10}
    function create_if_block(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(/*count*/ ctx[0]);
    			t1 = text(" is greater than 10");
    			add_location(p, file, 75, 4, 2575);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*count*/ 1) set_data_dev(t0, /*count*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(75:2) {#if count > 10}",
    		ctx
    	});

    	return block;
    }

    // (84:2) {#each menu as flavour}
    function create_each_block_1(ctx) {
    	let label;
    	let input;
    	let t0;
    	let t1_value = /*flavour*/ ctx[12] + "";
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", "scoops");
    			input.__value = 1;
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[10][0].push(input);
    			add_location(input, file, 85, 2, 2784);
    			add_location(label, file, 84, 4, 2774);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = input.__value === /*menu*/ ctx[2];
    			append_dev(label, t0);
    			append_dev(label, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[9]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*menu*/ 4) {
    				input.checked = input.__value === /*menu*/ ctx[2];
    			}

    			if (dirty & /*menu*/ 4 && t1_value !== (t1_value = /*flavour*/ ctx[12] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[10][0].splice(/*$$binding_groups*/ ctx[10][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(84:2) {#each menu as flavour}",
    		ctx
    	});

    	return block;
    }

    // (91:1) {#each menu as flavour}
    function create_each_block(ctx) {
    	let option;
    	let t0_value = /*flavour*/ ctx[12] + "";
    	let t0;
    	let t1;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*flavour*/ ctx[12];
    			option.value = option.__value;
    			add_location(option, file, 91, 2, 2988);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*menu*/ 4 && t0_value !== (t0_value = /*flavour*/ ctx[12] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*menu*/ 4 && option_value_value !== (option_value_value = /*flavour*/ ctx[12])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(91:1) {#each menu as flavour}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t3;
    	let p;
    	let t4;
    	let a;
    	let t6;
    	let t7;
    	let nested;
    	let t8;
    	let button0;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let input;
    	let t13;
    	let button1;
    	let t14;
    	let t15;
    	let button2;
    	let t17;
    	let button3;
    	let t19;
    	let t20;
    	let h2;
    	let t22;
    	let t23;
    	let select;
    	let current;
    	let mounted;
    	let dispose;
    	nested = new Nested({ $$inline: true });

    	function select_block_type(ctx, dirty) {
    		if (/*count*/ ctx[0] > 10) return create_if_block;
    		if (5 > /*count*/ ctx[0]) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);
    	let each_value_1 = /*menu*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*menu*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = `Hello ${/*name*/ ctx[5].toUpperCase()}!`;
    			t3 = space();
    			p = element("p");
    			t4 = text("Visit the ");
    			a = element("a");
    			a.textContent = "Svelte tutorial";
    			t6 = text(" to learn\n    how to build Svelte apps.");
    			t7 = space();
    			create_component(nested.$$.fragment);
    			t8 = space();
    			button0 = element("button");
    			t9 = text(/*count*/ ctx[0]);
    			t10 = text(" doubled ");
    			t11 = text(/*doubled*/ ctx[1]);
    			t12 = space();
    			input = element("input");
    			t13 = space();
    			button1 = element("button");
    			t14 = text(/*numbers*/ ctx[3]);
    			t15 = space();
    			button2 = element("button");
    			button2.textContent = "Click me";
    			t17 = space();
    			button3 = element("button");
    			button3.textContent = "Show position";
    			t19 = space();
    			if_block.c();
    			t20 = space();
    			h2 = element("h2");
    			h2.textContent = "Flavours";
    			t22 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t23 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "svelte-1qvb4ph");
    			add_location(h1, file, 63, 2, 2081);
    			attr_dev(a, "href", "https://svelte.dev/tutorial");
    			add_location(a, file, 65, 14, 2138);
    			add_location(p, file, 64, 2, 2120);
    			add_location(button0, file, 69, 2, 2257);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", "0");
    			attr_dev(input, "max", "10");
    			add_location(input, file, 70, 2, 2328);
    			add_location(button1, file, 71, 2, 2390);
    			add_location(button2, file, 72, 2, 2440);
    			add_location(button3, file, 73, 2, 2498);
    			add_location(h2, file, 81, 2, 2725);
    			select.multiple = true;
    			if (/*selected*/ ctx[4] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[11].call(select));
    			add_location(select, file, 89, 2, 2886);
    			attr_dev(main, "class", "svelte-1qvb4ph");
    			add_location(main, file, 62, 0, 2072);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t3);
    			append_dev(main, p);
    			append_dev(p, t4);
    			append_dev(p, a);
    			append_dev(p, t6);
    			append_dev(main, t7);
    			mount_component(nested, main, null);
    			append_dev(main, t8);
    			append_dev(main, button0);
    			append_dev(button0, t9);
    			append_dev(button0, t10);
    			append_dev(button0, t11);
    			append_dev(main, t12);
    			append_dev(main, input);
    			set_input_value(input, /*count*/ ctx[0]);
    			append_dev(main, t13);
    			append_dev(main, button1);
    			append_dev(button1, t14);
    			append_dev(main, t15);
    			append_dev(main, button2);
    			append_dev(main, t17);
    			append_dev(main, button3);
    			append_dev(main, t19);
    			if_block.m(main, null);
    			append_dev(main, t20);
    			append_dev(main, h2);
    			append_dev(main, t22);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(main, null);
    			}

    			append_dev(main, t23);
    			append_dev(main, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_options(select, /*selected*/ ctx[4]);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*incrementCount*/ ctx[6], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[8]),
    					listen_dev(button1, "click", /*addNumber*/ ctx[7], false, false, false),
    					listen_dev(button2, "click", handleClick, { once: true }, false, false),
    					listen_dev(button3, "click", getLocation, false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[11]),
    					listen_dev(
    						select,
    						"change",
    						function () {
    							if (is_function(onSelected(/*selected*/ ctx[4]))) onSelected(/*selected*/ ctx[4]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (!current || dirty & /*count*/ 1) set_data_dev(t9, /*count*/ ctx[0]);
    			if (!current || dirty & /*doubled*/ 2) set_data_dev(t11, /*doubled*/ ctx[1]);

    			if (dirty & /*count*/ 1 && to_number(input.value) !== /*count*/ ctx[0]) {
    				set_input_value(input, /*count*/ ctx[0]);
    			}

    			if (!current || dirty & /*numbers*/ 8) set_data_dev(t14, /*numbers*/ ctx[3]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(main, t20);
    				}
    			}

    			if (dirty & /*menu*/ 4) {
    				each_value_1 = /*menu*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(main, t23);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*menu*/ 4) {
    				each_value = /*menu*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*selected, menu*/ 20) {
    				select_options(select, /*selected*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nested.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nested.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(nested);
    			if_block.d();
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getLocation() {
    	if (navigator.geolocation) {
    		navigator.geolocation.getCurrentPosition(showPosition);
    	}
    }

    function showPosition(position) {
    	//can not be tested,
    	//todo
    	console.log("🚀 ~ file: App.svelte ~ line 31 ~ showPosition ~ position", position);

    	console.log("enlem" + position.coords.latitude, "boylarm:" + position.coords.longtitude);
    }

    function handleClick() {
    	alert("no more alerts");
    } // 		The full list of modifiers:
    // preventDefault — calls event.preventDefault() before running the handler. Useful for client-side form handling, for example.

    // stopPropagation — calls event.stopPropagation(), preventing the event reaching the next element
    // passive — improves scrolling performance on touch/wheel events (Svelte will add it automatically where it's safe to do so)
    // nonpassive — explicitly set passive: false
    // capture — fires the handler during the capture phase instead of the bubbling phase (MDN docs)
    // once — remove the handler after the first time it runs
    // self — only trigger handler if event.target is the element itself
    // trusted — only trigger handler if event.isTrusted is true. I.e. if the event is triggered by a user action.
    function onSelected(value) {
    	console.log("🚀 ~ file: App.svelte ~ line 58 ~ onSelected ~ value", value);
    }

    function instance($$self, $$props, $$invalidate) {
    	let doubled;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let name = "esraa";
    	let count = 0;
    	let menu = ["Cookies and cream", "Mint choc chip", "Raspberry ripple"];

    	function incrementCount() {
    		$$invalidate(0, count += 1);
    	}

    	let numbers = [];
    	let selected = {};

    	function addNumber() {
    		//   //normal push işlemi,
    		// numbers.push(numbers.length + 1);
    		// //otomatik görmeyeceği için
    		// //Svelte's reactivity is triggered by assignments
    		// numbers = numbers;
    		//instead of
    		$$invalidate(3, numbers = [...numbers, numbers.length + 1]);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_input_handler() {
    		count = to_number(this.value);
    		$$invalidate(0, count);
    	}

    	function input_change_handler() {
    		menu = this.__value;
    		$$invalidate(2, menu);
    	}

    	function select_change_handler() {
    		selected = select_multiple_value(this);
    		$$invalidate(4, selected);
    		$$invalidate(2, menu);
    	}

    	$$self.$capture_state = () => ({
    		Nested,
    		name,
    		count,
    		menu,
    		incrementCount,
    		numbers,
    		selected,
    		addNumber,
    		getLocation,
    		showPosition,
    		handleClick,
    		onSelected,
    		doubled
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(5, name = $$props.name);
    		if ('count' in $$props) $$invalidate(0, count = $$props.count);
    		if ('menu' in $$props) $$invalidate(2, menu = $$props.menu);
    		if ('numbers' in $$props) $$invalidate(3, numbers = $$props.numbers);
    		if ('selected' in $$props) $$invalidate(4, selected = $$props.selected);
    		if ('doubled' in $$props) $$invalidate(1, doubled = $$props.doubled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*count*/ 1) {
    			$$invalidate(1, doubled = count * 2);
    		}

    		if ($$self.$$.dirty & /*doubled*/ 2) ;
    	};

    	return [
    		count,
    		doubled,
    		menu,
    		numbers,
    		selected,
    		name,
    		incrementCount,
    		addNumber,
    		input_input_handler,
    		input_change_handler,
    		$$binding_groups,
    		select_change_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map

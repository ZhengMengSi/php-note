import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    h,
} from "snabbdom";

const patch = init([
    // Init patch function with chosen modules
    classModule, // makes it easy to toggle classes
    propsModule, // for setting properties on DOM elements
    styleModule, // handles styling on elements with support for animations
    eventListenersModule, // attaches event listeners
]);

/*const container = document.getElementById("container");

const vnode = h(
    "div#container.two.classes",
    {
        on: {
            click: function () {}
        }
    },
    [
        h("span", { style: { fontWeight: "bold" } }, "This is bold"),
        " and this is just normal text",
        h("a", { props: { href: "/foo" } }, "I'll take you places!"),
    ]
);
console.log(vnode);
// Patch into empty DOM element – this modifies the DOM as a side effect
patch(container, vnode);

const newVnode = h(
    "div#container.two.classes",
    {
        on: {
            click: function () {}
        }
    },
    [
        h(
            "span",
            { style: { fontWeight: "normal", fontStyle: "italic" } },
            "This is now italic type"
        ),
        " and this is still just normal text",
        h("a", { props: { href: "/bar" } }, "I'll take you places!"),
    ]
);
// Second `patch` invocation
patch(vnode, newVnode); // Snabbdom efficiently updates the old view to the new state*/

var myVnode1 = h(
    'a',
    {
        props: {
            href: 'http://www.atguigu.com',
            target: '_blank'
        }
    },
    '尚硅谷'
);

const myVnode2 = h('div', '我是一个盒子');

const myVnode3 = h('ul', [
    h('li', '苹果'),
    h('li', [
        h('div', [
            h('p', '经济'),
            h('p', h('span', '经济')),
        ])
    ]),
])

var container = document.getElementById('container');
patch(container, myVnode3);

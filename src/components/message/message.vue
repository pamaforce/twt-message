<template>
    <transition name="message-fade">
        <div
            v-ripple
            class="message"
            :class="type"
            role="alert"
            v-show="visible"
        >
            <p>
                {{ message }}
            </p>
        </div>
    </transition>
</template>

<script>
export default {
    name: "message",

    data() {
        return {
            visible: false,
            message: "",
            closed: false,
            color: "",
            type: "",
        };
    },

    watch: {
        closed(val) {
            if (val) {
                this.visible = false;
                this.$el.addEventListener("transitionend", this.destroyElement);
            }
        },
    },

    methods: {
        destroyElement() {
            this.$el.removeEventListener("transitionend", this.destroyElement);
            this.$destroy(true);
            this.$el.parentNode.removeChild(this.$el);
        },

        close() {
            this.closed = true;
        },
    },
};
</script>

<style lang="scss" scoped>
.message {
    height: 42px;
    box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
        0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
    min-width: 240px;
    box-sizing: border-box;
    border-radius: 4px;
    position: fixed;
    left: 50%;
    padding: 15px 15px 15px 20px;
    display: flex;
    align-items: center;
    transform: translateX(-50%);
    transition: all 0.3s, transform 0.4s;
    overflow: hidden;
    > p {
      color: white;
        height: 100%;
        line-height: 100%;
        padding: 20px 0;
        font-size: 14px !important;
        font-weight: 400;
        letter-spacing: 0.03125em !important;
        font-family: "Roboto", sans-serif !important;
    }
}

.message-fade-enter,
.message-fade-leave-active {
    opacity: 0;
    transform: translate(-50%, -50px);
}
</style>

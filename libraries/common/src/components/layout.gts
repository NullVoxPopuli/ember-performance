export const Layout = <template>
  <div class="container">
    <h3 class="text-muted" id="test-title">{{@name}}</h3>
    <h4>
      Ember Version:
      <span id="ember-version">{{@version}}</span>
    </h4>
    <h4 id="remaining-text">{{yield to="remaining"}}</h4>

    <p id="status-text">{{yield to="status"}}</p>

    <p id="progress">{{yield to="progress"}}</p>

    {{! This is where the scenario is actually rendered }}
    <div id="scratch">{{yield to="scratch"}}</div>
  </div>
</template>;

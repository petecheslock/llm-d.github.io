# Tabs Example

This guide demonstrates how to use tabs in Docusaurus documentation.

## Basic Tabs

Docusaurus provides built-in support for tabs using the `@theme/Tabs` and `@theme/TabItem` components.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="docker" label="Docker" default>
    ```bash
    # Run llm-d with Docker
    docker run -it --rm llm-d/llm-d:latest
    ```
  </TabItem>
  <TabItem value="kubernetes" label="Kubernetes">
    ```bash
    # Deploy llm-d on Kubernetes
    kubectl apply -f llm-d-deployment.yaml
    ```
  </TabItem>
  <TabItem value="source" label="From Source">
    ```bash
    # Build and run from source
    git clone https://github.com/llm-d/llm-d.git
    cd llm-d
    make build
    ./bin/llm-d
    ```
  </TabItem>
</Tabs>

## Tabs with Different Languages

You can use tabs to show code examples in different programming languages:

<Tabs groupId="programming-language">
  <TabItem value="python" label="Python" default>
    ```python
    import requests

    # Make a request to llm-d inference endpoint
    response = requests.post(
        "http://localhost:8080/v1/completions",
        json={
            "model": "llama-3.1-8b",
            "prompt": "What is llm-d?",
            "max_tokens": 100
        }
    )
    print(response.json())
    ```
  </TabItem>
  <TabItem value="javascript" label="JavaScript">
    ```javascript
    // Make a request to llm-d inference endpoint
    const response = await fetch('http://localhost:8080/v1/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b',
        prompt: 'What is llm-d?',
        max_tokens: 100
      })
    });
    const data = await response.json();
    console.log(data);
    ```
  </TabItem>
  <TabItem value="curl" label="cURL">
    ```bash
    curl -X POST http://localhost:8080/v1/completions \
      -H "Content-Type: application/json" \
      -d '{
        "model": "llama-3.1-8b",
        "prompt": "What is llm-d?",
        "max_tokens": 100
      }'
    ```
  </TabItem>
  <TabItem value="go" label="Go">
    ```go
    package main

    import (
        "bytes"
        "encoding/json"
        "fmt"
        "net/http"
    )

    func main() {
        url := "http://localhost:8080/v1/completions"
        payload := map[string]interface{}{
            "model":      "llama-3.1-8b",
            "prompt":     "What is llm-d?",
            "max_tokens": 100,
        }
        
        jsonData, _ := json.Marshal(payload)
        resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
        if err != nil {
            panic(err)
        }
        defer resp.Body.Close()
        
        var result map[string]interface{}
        json.NewDecoder(resp.Body).Decode(&result)
        fmt.Println(result)
    }
    ```
  </TabItem>
</Tabs>

## Synchronized Tabs

When you use the same `groupId` prop across multiple tab groups, selecting a tab in one group will automatically select the corresponding tab in all other groups with the same `groupId`. This is useful for maintaining consistency across multiple code examples.

### Configuration Example

<Tabs groupId="config-format">
  <TabItem value="yaml" label="YAML" default>
    ```yaml
    # llm-d configuration
    server:
      host: 0.0.0.0
      port: 8080
    model:
      name: llama-3.1-8b
      path: /models/llama-3.1-8b
    inference:
      max_batch_size: 32
      max_sequence_length: 4096
    ```
  </TabItem>
  <TabItem value="json" label="JSON">
    ```json
    {
      "server": {
        "host": "0.0.0.0",
        "port": 8080
      },
      "model": {
        "name": "llama-3.1-8b",
        "path": "/models/llama-3.1-8b"
      },
      "inference": {
        "max_batch_size": 32,
        "max_sequence_length": 4096
      }
    }
    ```
  </TabItem>
  <TabItem value="toml" label="TOML">
    ```toml
    # llm-d configuration
    [server]
    host = "0.0.0.0"
    port = 8080

    [model]
    name = "llama-3.1-8b"
    path = "/models/llama-3.1-8b"

    [inference]
    max_batch_size = 32
    max_sequence_length = 4096
    ```
  </TabItem>
</Tabs>

### Command Line Options

<Tabs groupId="config-format">
  <TabItem value="yaml" label="YAML">
    ```bash
    # Load configuration from YAML file
    llm-d serve --config config.yaml
    ```
  </TabItem>
  <TabItem value="json" label="JSON">
    ```bash
    # Load configuration from JSON file
    llm-d serve --config config.json
    ```
  </TabItem>
  <TabItem value="toml" label="TOML">
    ```bash
    # Load configuration from TOML file
    llm-d serve --config config.toml
    ```
  </TabItem>
</Tabs>

:::tip
Notice how selecting a format in the first tab group automatically switches the second tab group to the same format! This is because they share the same `groupId="config-format"`.
:::

## Tab Features

### Setting a Default Tab

Use the `default` prop on a `TabItem` to make it the initially selected tab:

```jsx
<TabItem value="option1" label="Option 1" default>
```

### Custom Tab Labels

The `label` prop allows you to set custom display text that's different from the internal `value`:

```jsx
<TabItem value="k8s" label="Kubernetes ☸️">
```

### Group IDs for Synchronized Selection

Use the `groupId` prop on the `Tabs` component to synchronize tab selections across multiple tab groups:

```jsx
<Tabs groupId="my-group">
```

## Tips for Using Tabs

1. **Import at the top**: Always import the tab components at the beginning of your markdown file
2. **Unique values**: Each `TabItem` must have a unique `value` within its parent `Tabs` component
3. **Default tab**: Mark one tab as `default` to ensure a good initial experience
4. **Group IDs**: Use `groupId` to synchronize related tab selections across different sections
5. **Accessibility**: Provide clear, descriptive labels for all tabs

## Source Markdown

Here's what the markdown looks like for the basic tabs example above:

````markdown
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="docker" label="Docker" default>
    ```bash
    # Run llm-d with Docker
    docker run -it --rm llm-d/llm-d:latest
    ```
  </TabItem>
  <TabItem value="kubernetes" label="Kubernetes">
    ```bash
    # Deploy llm-d on Kubernetes
    kubectl apply -f llm-d-deployment.yaml
    ```
  </TabItem>
  <TabItem value="source" label="From Source">
    ```bash
    # Build and run from source
    git clone https://github.com/llm-d/llm-d.git
    cd llm-d
    make build
    ./bin/llm-d
    ```
  </TabItem>
</Tabs>
````

For more information, see the [official Docusaurus Tabs documentation](https://docusaurus.io/docs/markdown-features/tabs).


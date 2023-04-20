package com.example.demo3;

import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.annotation.Resource;
import java.util.Map;

@Component
public class EmailHandler {

    @Resource(name = "StringTemplateEngine")
    private SpringTemplateEngine springTemplateEngine;

    public String resorverTemplate(String template, Map<String, Object> source) {
        Context context = new Context();
        context.setVariables(source);
        return springTemplateEngine.process(template, context);
    }
}
